using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Hosting;
using MarkSite.Core;

public class PageSystem
{
	public const string CACHE_KEY = "indexpage";

	public static MarkdownPage IndexPage
	{
		get
		{
			if (HttpRuntime.Cache[CACHE_KEY] == null)
			{
				string folder = ConfigurationManager.AppSettings.Get("folder");
				string[] files = Directory.GetFiles(HostingEnvironment.MapPath(folder), "*.md", SearchOption.AllDirectories);
				HttpRuntime.Cache.Insert(CACHE_KEY, Parse(), new CacheDependency(files));
			}

			return (MarkdownPage)HttpRuntime.Cache[CACHE_KEY];
		}
	}

	private static MarkdownPage Parse()
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