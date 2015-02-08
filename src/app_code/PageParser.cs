using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Html.Core.Tree;
using Microsoft.Html.Core.Tree.Nodes;
using Microsoft.Web.Core.Text;

public class PageParser
{
	private const string _index = "index.md";

	public PageParser()
	{
		IsValid = true;
		ValidationMessages = new List<string>();
	}

	public bool IsValid { get; private set; }
	public List<string> ValidationMessages { get; set; }
	public string BaseDirectory { get; private set; }

	public MarkdownPage Parse(string directory)
	{
		BaseDirectory = directory;
		string index = Path.Combine(directory, _index);
		MarkdownPage page = ParsePage(index);

		foreach (string dir in GetChildDirectories(directory))
		{
			RecursiveFindChildren(dir, page);
		}

		return page;
	}

	private void RecursiveFindChildren(string directory, MarkdownPage parent)
	{
		string index = Path.Combine(directory, _index);
		MarkdownPage newParent = ParsePage(index);
		ValidatePage(newParent);
		newParent.Parent = parent;

		foreach (string file in Directory.EnumerateFiles(directory, "*.md").Where(f => Path.GetFileName(f) != _index))
		{
			MarkdownPage child = ParsePage(file);
			child.Parent = newParent;
			ValidatePage(child);
			newParent.Children.Add(child);
		}

		parent.Children.Add(newParent);

		foreach (string childDir in GetChildDirectories(directory))
		{
			RecursiveFindChildren(childDir, newParent);
		}

		parent.Children.Sort(new PageComparer());
	}

	private static IEnumerable<string> GetChildDirectories(string parentDirectory)
	{
		return Directory.EnumerateDirectories(parentDirectory).Where(d => !new DirectoryInfo(d).Name.StartsWith("_"));
	}

	private MarkdownPage ParsePage(string fileName)
	{
		string html = CommonMark.CommonMarkConverter.Convert(File.ReadAllText(fileName));

		HtmlTree tree = new HtmlTree(new TextStream(html));
		tree.Build();

		ElementNode firstChild = tree.RootNode.Children[0];
		ElementNode prop = firstChild.Children[0];
		tree.RootNode.RemoveChild(0);

		MarkdownPage page = new MarkdownPage();
		page.Title = AttrValue(prop, "pageTitle");
		page.Description = AttrValue(prop, "description");
		page.Content = html.Substring(firstChild.End, tree.RootNode.Length - firstChild.End).Trim();
		page.Keywords = AttrValue(prop, "keywords");
		page.Slug = AttrValue(prop, "slug");
		page.DateModified = File.GetLastWriteTime(fileName);
		page.FileName = fileName;

		if (prop.GetAttribute("order") != null)
		{
			page.Order = int.Parse(prop.GetAttribute("order").Value);
		}
		else
		{
			page.Order = int.MaxValue;
		}

		return page;
	}

	public static string AttrValue(ElementNode element, string attributeName)
	{
		AttributeNode attr = element.GetAttribute(attributeName);
		return attr != null ? attr.Value : null;
	}

	private void ValidatePage(MarkdownPage page)
	{
		string relative = page.FileName.Replace(BaseDirectory, string.Empty);

		if (string.IsNullOrEmpty(page.Title))
		{
			ValidationMessages.Add(string.Format("Title must be set | {0}", relative));
			IsValid = false;
		}

		if (string.IsNullOrEmpty(page.Description))
		{
			ValidationMessages.Add(string.Format("Description must be set | {0}", relative));
			IsValid = false;
		}

		if (string.IsNullOrEmpty(page.Slug))
		{
			ValidationMessages.Add(string.Format("Slug must be set | {0}", relative));
			IsValid = false;
		}
		else if (page.Slug.Any(c => char.IsUpper(c) || char.IsWhiteSpace(c) || char.IsSymbol(c)))
		{
			ValidationMessages.Add(string.Format("Slug must be alphanumeric and lower case only | {0}", relative));
			IsValid = false;
		}

		if (string.IsNullOrEmpty(page.Keywords) || page.Keywords.Count(c => c == ',') < 2)
		{
			ValidationMessages.Add(string.Format("At least 3 comma separated keywords must be specified | {0}", relative));
			IsValid = false;
		}
	}
}