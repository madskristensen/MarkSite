using System.Collections.Generic;
using System.Linq;

namespace MarkSite.Core
{
	public class Validator
	{
		public Validator()
		{
			IsValid = true;
			ValidationMessages = new List<string>();
		}

		public bool IsValid { get; private set; }

		public List<string> ValidationMessages { get; set; }

		public void Validate(MarkdownPage page, string directory)
		{
			ValidatePage(page, directory);

			foreach (MarkdownPage child in page.Children)
			{
				Validate(child, directory);
			}
		}

		private void ValidatePage(MarkdownPage page, string directory)
		{
			string relative = page.FileName.Replace(directory, string.Empty);

			if (string.IsNullOrEmpty(page.Title))
			{
				ValidationMessages.Add(string.Format("Title must be set ({0})", relative));
				IsValid = false;
			}

			if (string.IsNullOrEmpty(page.Description))
			{
				ValidationMessages.Add(string.Format("Description must be set ({0})", relative));
				IsValid = false;
			}

			if (string.IsNullOrEmpty(page.Slug))
			{
				ValidationMessages.Add(string.Format("Slug must be set ({0})", relative));
				IsValid = false;
			}
			else if (page.Slug.Any(c => char.IsUpper(c) || char.IsWhiteSpace(c) || char.IsSymbol(c)))
			{
				ValidationMessages.Add(string.Format("Slug must be alphanumeric and lower case only ({0})", relative));
				IsValid = false;
			}

			if (string.IsNullOrEmpty(page.Keywords) || page.Keywords.Count(c => c == ',') < 2)
			{
				ValidationMessages.Add(string.Format("At least 3 comma separated keywords must be specified ({0})", relative));
				IsValid = false;
			}
		}
	}
}
