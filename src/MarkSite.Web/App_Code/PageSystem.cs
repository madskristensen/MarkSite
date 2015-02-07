using System;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using MarkSite.Core;

public class PageSystem
{
	static PageSystem()
	{
		IndexPage = GetPages();
	}

	public static MarkdownPage IndexPage { get; private set; }

	private static MarkdownPage GetPages()
	{
		string directory = HostingEnvironment.MapPath("~/pages");
		Parser parser = new Parser();
		MarkdownPage index = parser.Parse(directory);

		return index;
	}

	public static MarkdownPage GetCurrentPage(HttpRequestBase request)
	{
		string raw = request.QueryString["path"];

		if (string.IsNullOrWhiteSpace(raw))
			return IndexPage;

		string[] segments = raw.Split(new[] { "/" }, StringSplitOptions.RemoveEmptyEntries);

		MarkdownPage page = IndexPage;

		foreach (string segment in segments)
		{
			page = page.Children.First(c => c.Slug.Equals(segment, StringComparison.OrdinalIgnoreCase));
		}

		return page;
	}

	public static string GetTitle(MarkdownPage page)
	{
		if (page.Parent != null && page.Parent != IndexPage)
			return page.Parent.Title + " | " + page.Title;

		return page.Title;
	}
}