using System;
using System.IO;
using System.Linq;
using Microsoft.Html.Core.Tree;
using Microsoft.Html.Core.Tree.Nodes;
using Microsoft.Web.Core.Text;

namespace MarkSite.Core
{
	public class Parser
	{
		private const string _index = "index.md";

		public MarkdownPage Parse(string directory)
		{
			string index = Path.Combine(directory, _index);
			MarkdownPage page = ParsePage(index);

			foreach (string dir in Directory.EnumerateDirectories(directory))
			{
				RecursiveFindChildren(dir, page);
			}

			Validator validator = new Validator();
			validator.Validate(page, directory);

			if (!validator.IsValid)
				throw new Exception(string.Join(Environment.NewLine, validator.ValidationMessages));

			return page;
		}

		private void RecursiveFindChildren(string directory, MarkdownPage parent)
		{
			string index = Path.Combine(directory, _index);
			MarkdownPage newParent = ParsePage(index);
			newParent.Parent = parent;

			foreach (string file in Directory.EnumerateFiles(directory, "*.md").Where(f => Path.GetFileName(f) != _index))
			{
				MarkdownPage child = ParsePage(file);
				child.Parent = newParent;
				newParent.Children.Add(child);
			}

			parent.Children.Add(newParent);

			foreach (string childDir in Directory.EnumerateDirectories(directory))
			{
				RecursiveFindChildren(childDir, newParent);
			}

			parent.Children.Sort(new PageComparer());
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
			page.Title = AttrValue(prop,"pageTitle");
			page.Description = AttrValue( prop, "description");
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
	}
}
