import streamlit as st
from services.youtube_service import search_youtube
from services.gemini_service import fetch_info

# Title of the app
st.title("YouTube Learning Assistant")

# User Input
user_query = st.text_input("Enter search query:")

if user_query:
    # Fetch YouTube videos
    youtube_results = search_youtube(user_query)

    # Fetch books & educational websites
    info = fetch_info(user_query)

    # Display Results
    st.subheader("📌 YouTube Search Results:")
    for idx, video in enumerate(youtube_results, start=1):
        st.write(f"{idx}. **{video['title']}** - {video['creator']} - [Watch here]({video['link']})")

    st.subheader("📚 Free Books & Educational Websites:")
    st.write(info)