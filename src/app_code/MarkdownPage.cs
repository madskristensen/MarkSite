using System;
using System.Collections.Generic;

public class MarkdownPage
{
	public MarkdownPage()
	{
		Children = new List<MarkdownPage>();
	}

	public string Title { get; set; }
	public string Description { get; set; }
	public string Keywords { get; set; }
	public string Slug { get; set; }
	public string Content { get; set; }
	public DateTime DateModified { get; set; }
	public MarkdownPage Parent { get; set; }
	public List<MarkdownPage> Children { get; private set; }
	public string FileName { get; set; }
	public int Order { get; set; }

	public override string ToString()
	{
		return Title;
	}
}

public class PageComparer : IComparer<MarkdownPage>
{
	public int Compare(MarkdownPage x, MarkdownPage y)
	{
		if (x.Order == y.Order)
			return 0;

		if (x.Order > y.Order)
			return 1;

		return -1;
	}
}