# Debugging Address Fetching

## Goal
Resolve "Address not found" issue on the dashboard.

## Potential Causes
1. **Frontend**: Invalid coordinates passed to API.
2. **Backend**: Proxy endpoint failing (500/400 error).
3. **External API**: Nominatim blocking requests (User-Agent issue).

## Steps
1. Add logging to `DashboardPage.jsx` (Frontend).
2. Add logging to `utilityController.js` (Backend).
3. Verify `User-Agent` header in backend request.
4. Test endpoint manually with curl.

## Manual Verification Command
```bash
curl "http://localhost:5000/api/utility/geocode?lat=26.8381&lng=75.5687"
```
