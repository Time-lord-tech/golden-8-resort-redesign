---
description: Free Local Lead Generation and Enrichment Workflow (AI Website Agency System)
---
# Local Lead Generation and Data Enrichment

This workflow automates finding local businesses and extracting their email addresses for outreach using our custom MCP tools, completely for free.

## Required Setup
Ensure the local Apify MCP server is running and the `APIFY_TOKEN` is set in the environment or connection settings.

## Workflow Steps

1. Ask the User for their target niche, location, and the desired number of leads (e.g., "15 Pool cleaners in Austin").
2. Call the `generate_local_leads` MCP tool.
   * Pass the target query as `searchStringsArray` (e.g., `["Pool cleaners in Austin"]`).
   * Pass the desired number of leads as `maxPlaces` (default 15).
3. From the JSON response of `generate_local_leads`, extract all the valid `website` URLs into an array. Do not extract websites from businesses that don't have one.
4. Call the `find_emails_free` MCP tool, passing the extracted array of `urls`.
5. Merge the datasets.
   * For each lead in the original dataset, look up its website in the `find_emails_free` results.
   * If emails are found, replace the lead's existing email column with the newly found email.
   * **Crucial Formatting:** Ensure there is only ONE primary email per lead (pick the first valid one, remove any semicolons/colons or multiple emails). This prevents upload errors when the user imports the CSV into Instantly.ai or Anymail.
6. Export the final merged dataset to a `.csv` file in the current working directory, naming it `[niche]-[location]-leads.csv`. Make sure to wrap CSV fields in double quotes to prevent comma breaking.
7. Notify the user that the file has been successfully generated and is ready for export and email outreach.
