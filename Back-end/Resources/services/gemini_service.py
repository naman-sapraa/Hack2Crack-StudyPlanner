def fetch_info(query):
    import google.generativeai as genai
    from config.keys import GEMINI_API_KEY

    genai.configure(api_key=GEMINI_API_KEY)

    prompt = f"""
    1. Suggest **free online books** related to '{query}' with a **link to read**.
    2. Recommend **free educational websites** where users can learn about '{query}', including the **website link**.
    """
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(prompt)
    return response.text