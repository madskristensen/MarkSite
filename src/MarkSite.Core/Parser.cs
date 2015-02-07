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
			MarkdownPage parent = ParsePage(index);

			foreach (string dir in Directory.EnumerateDirectories(directory))
			{
				RecursiveFindChildren(dir, parent);
			}

			return parent;
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
			page.Title = prop.AttrValue("pageTitle", fileName);
			page.Description = prop.AttrValue("description", fileName);
			page.Content = html.Substring(firstChild.End, tree.RootNode.Length - firstChild.End).Trim();
			page.Keywords = prop.AttrValue("keywords", fileName);
			page.Slug = prop.AttrValue("slug", fileName);

			return page;
		}
	}
}
