const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export async function generateItinerary(tripData) {
  const {
    destination,
    startDate,
    endDate,
    duration,
    flexibleDates,
    adults,
    children,
    tripType,
    interests,
    budget,
    specialRequests,
  } = tripData;

  const systemPrompt = `You are an expert travel planner with deep knowledge of destinations worldwide.
Generate detailed, personalized travel itineraries in structured JSON format.
CRITICAL: Respond with ONLY valid JSON. No markdown, no backticks, no explanation text before or after.
The response must be parseable by JSON.parse() directly.

JSON Structure you must follow exactly:
{
  "tripTitle": "string - creative trip name",
  "destination": "string",
  "summary": "string - 2-3 engaging sentences about the trip",
  "duration": number,
  "bestTimeToVisit": "string",
  "weatherInfo": "string - what to expect weather-wise",
  "estimatedBudget": {
    "total": "string e.g. $1,200 - $1,800",
    "perDay": "string e.g. $120 - $180",
    "breakdown": {
      "accommodation": "string e.g. $50-80/night",
      "food": "string e.g. $30-50/day",
      "transport": "string e.g. $15-25/day",
      "activities": "string e.g. $20-30/day"
    }
  },
  "quickTips": ["string", "string", "string", "string", "string"],
  "days": [
    {
      "day": number,
      "date": "string - formatted date if dates provided, else Day 1 etc",
      "theme": "string - e.g. Exploring the Old Town",
      "morning": {
        "time": "string e.g. 8:00 AM",
        "activity": "string - activity name",
        "description": "string - 2 sentences",
        "location": "string - specific place name",
        "duration": "string e.g. 2 hours",
        "cost": "string e.g. Free / $15 per person",
        "tip": "string - one insider tip"
      },
      "afternoon": {
        "time": "string e.g. 2:00 PM",
        "activity": "string - activity name",
        "description": "string - 2 sentences",
        "location": "string - specific place name",
        "duration": "string e.g. 2 hours",
        "cost": "string e.g. Free / $15 per person",
        "tip": "string - one insider tip"
      },
      "evening": {
        "time": "string e.g. 7:00 PM",
        "activity": "string - activity name",
        "description": "string - 2 sentences",
        "location": "string - specific place name",
        "duration": "string e.g. 2 hours",
        "cost": "string e.g. Free / $15 per person",
        "tip": "string - one insider tip"
      },
      "meals": {
        "breakfast": { "name": "string", "cuisine": "string", "priceRange": "string" },
        "lunch": { "name": "string", "cuisine": "string", "priceRange": "string" },
        "dinner": { "name": "string", "cuisine": "string", "priceRange": "string" }
      },
      "accommodation": {
        "name": "string",
        "type": "string e.g. Boutique Hotel",
        "area": "string - neighborhood",
        "priceRange": "string",
        "whyWeRecommend": "string - one sentence"
      },
      "transport": "string - how to get around this day",
      "dayBudget": "string e.g. $150 - $200"
    }
  ],
  "packingList": ["string", "string"],
  "emergencyInfo": {
    "police": "string",
    "ambulance": "string",
    "touristHelpline": "string or N/A"
  },
  "nearbyDestinations": ["string", "string", "string"]
}`;

  const userMessage = `Plan a trip to ${destination} for ${flexibleDates ? duration + ' days' : `${duration} days from ${startDate} to ${endDate}`}.
Travelers: ${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}.
Trip type: ${tripType}.
Interests: ${interests.join(', ')}.
Budget level: ${budget}.
${specialRequests ? `Special requests: ${specialRequests}` : ''}
Generate a complete day-by-day itinerary following the JSON structure exactly.`;

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Add VITE_GROQ_API_KEY to .env');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new Error('Our AI is busy right now. Please wait a moment and try again.');
    }
    throw new Error(error.error?.message || 'Failed to generate itinerary');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) throw new Error('Empty response from AI');

  const cleaned = content
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('The AI returned an unexpected response. Please try generating again.');
  }
}
