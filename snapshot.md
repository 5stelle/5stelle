Google Reviews Tracking System for 5stelle
Implement a system to track Google Reviews over time for each client, so we can show a before/after comparison of their review performance since they started using 5stelle.
How it works:
1. Onboarding snapshot: When a new client is added, fetch their Google Place Details (rating, total review count, and the 5 most recent reviews) and store it as the baseline.
2. Daily cron job: Once a day, fetch the same data for all active clients and store a new snapshot row. This gives us a time series to build charts and comparisons from.
3. Dashboard display: Show the client their progress — rating trend, review count growth, and a clear "before 5stelle / after 5stelle" comparison. Mark the start date visually.
Technical notes:
* Use the Google Places API (New) — specifically the Place Details endpoint with field mask for rating, userRatingCount, and reviews.
* We use a single API key (server-side only, never exposed to the client) for all clients. Restrict it by IP or server environment.
* Store the Google Place ID for each client in their profile. We can use the Places API Text Search to look up the Place ID from the restaurant name + address during onboarding.
* The cron job should be lightweight — one API call per client per day.
* Store snapshots in Supabase with at minimum: client_id, fetched_at, rating, review_count, and optionally the recent reviews as JSONB.
Important: Discuss the schema and implementation approach with me before coding. I want to review the table structure and the cron setup before you start building.
