from googleapiclient.discovery import build
from config.keys import YOUTUBE_API_KEY

def search_youtube(query, max_results=5):
    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
    request = youtube.search().list(
        q=query,
        part="snippet",
        type="video",
        maxResults=max_results
    )
    response = request.execute()
    
    video_details = []
    for item in response.get("items", []):
        title = item["snippet"]["title"]
        channel = item["snippet"]["channelTitle"]
        video_details.append({"title": title, "creator": channel, "link": f"https://www.youtube.com/watch?v={item['id']['videoId']}"})
    
    return video_details