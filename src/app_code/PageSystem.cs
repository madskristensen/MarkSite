using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Hosting;

public class PageSystem
{
	public const string CACHE_KEY = "indexpage";
	private static string _folder = HostingEnvironment.MapPath(ConfigurationManager.AppSettings.Get("pageFolder"));

	public static MarkdownPage IndexPage
	{
		get
		{
			if (HttpRuntime.Cache[CACHE_KEY] == null)
			{
				string[] files = Directory.GetDirectories(_folder, "*", SearchOption.AllDirectories).Union(new[] { _folder }).ToArray();
				HttpRuntime.Cache.Insert(CACHE_KEY, Parse(), new CacheDependency(files));
			}

			return (MarkdownPage)HttpRuntime.Cache[CACHE_KEY];
		}
	}

	private static MarkdownPage Parse()
	{
		string directory = HostingEnvironment.MapPath("~/pages");
		PageParser parser = new PageParser(directory);
		MarkdownPage index = parser.Parse();

		if (!parser.IsValid)
		{
			var args = parser.ValidationMessages.Select(m => string.Join("in", m.Split('|')));
			throw new Exception(string.Join(Environment.NewLine, args));
		}

		return index;
	}

	public static MarkdownPage GetCurrentPage(HttpRequestBase request)
	{
		string raw = request.QueryString["path"];

		if (string.IsNullOrWhiteSpace(raw))
			return IndexPage;

		try {
			string[] segments = raw.Split(new[] { "/" }, StringSplitOptions.RemoveEmptyEntries);

			MarkdownPage page = IndexPage;

			foreach (string segment in segments)
			{
				page = page.Children.First(c => c.Slug.Equals(segment, StringComparison.OrdinalIgnoreCase));
			}

			return page;
		}
		catch (Exception ex)
		{
			throw new HttpException(404, "Page not found", ex);
		}
	}

	public static string GetTitle(MarkdownPage page)
	{
		if (page.Parent != null && page.Parent != IndexPage)
			return page.Parent.Title + " | " + page.Title;

		return page.Title;
	}

	public static string GetEditPage(MarkdownPage page)
	{
		return string.Format(ConfigurationManager.AppSettings.Get("editUrl"), page.FileName);
	}

	public static DateTime SetCacheHeaders(HttpContextBase context)
	{
		string[] allFiles = Directory.GetDirectories(context.Server.MapPath("~/"), "*.*", SearchOption.AllDirectories);
        DateTime lastModified = allFiles.Max(f => File.GetLastWriteTime(f));
		HttpResponseBase response = context.Response;
		HttpRequestBase request = context.Request;
		lastModified = new DateTime(lastModified.Year, lastModified.Month, lastModified.Day, lastModified.Hour, lastModified.Minute, lastModified.Second);

		string incomingDate = request.Headers["If-Modified-Since"];

		response.Cache.SetLastModified(lastModified);

		DateTime testDate = DateTime.MinValue;

		if (DateTime.TryParse(incomingDate, out testDate) && testDate == lastModified)
		{
			response.ClearContent();
			response.StatusCode = (int)System.Net.HttpStatusCode.NotModified;
			response.SuppressContent = true;
		}

		if (!request.IsLocal)
		{
			response.Cache.SetValidUntilExpires(true);
			response.Cache.SetCacheability(HttpCacheability.ServerAndPrivate);
			response.Cache.VaryByParams["path"] = true;
			response.AddFileDependencies(allFiles);
			response.Cache.SetLastModifiedFromFileDependencies();
		}

		return lastModified;
	}
}