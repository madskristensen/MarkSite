using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Hosting;
using MarkSite.Core;

public class PageSystem
{
	public static MarkdownPage IndexPage
	{
		get
		{
			if (HttpRuntime.Cache["indexpage"] == null)
			{
				string[] files = Directory.GetFiles(HostingEnvironment.MapPath("~/pages"), "*.md", SearchOption.AllDirectories);
				HttpRuntime.Cache.Insert("indexpage", GetPages(), new CacheDependency(files));
            }

			return (MarkdownPage)HttpRuntime.Cache["indexpage"]; 
        }
	}

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

		if (HttpRuntime.Cache[raw] == null)
		{

			string[] segments = raw.Split(new[] { "/" }, StringSplitOptions.RemoveEmptyEntries);

			MarkdownPage page = IndexPage;

			foreach (string segment in segments)
			{
				page = page.Children.First(c => c.Slug.Equals(segment, StringComparison.OrdinalIgnoreCase));
			}

			HttpRuntime.Cache[raw] = page;
		}

		return (MarkdownPage)HttpRuntime.Cache[raw];
	}

	public static string GetTitle(MarkdownPage page)
	{
		if (page.Parent != null && page.Parent != IndexPage)
			return page.Parent.Title + " | " + page.Title;

		return page.Title;
	}
}