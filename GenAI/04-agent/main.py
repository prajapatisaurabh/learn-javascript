from dotenv import load_dotenv
from openai import OpenAI
from datetime import datetime

load_dotenv()
client = OpenAI()


def get_weather(location):
    if location.lower() == "ahmedabad":
        return "43 degree Celsius"
    else:
        return "Sorry, I don't have weather information for that location."
    



SYSTEM_PROMPT = f"""
   You are helpful AI Assistant. You can answer questions and perform tasks for the user.
   You work on start, plan , action and observe mode.

   For the qiven user query and avaliable tools and plan the step by step execution, based on the planning.
   select the relavent tool and execute the task and observe the output, based on the output you can plan the next step and execute it.

   wait for the observations before planning the next step, and execute it.

   Rules:
    - You can only use the tools provided to you, and you should not make any assumptions
    - You should always wait for the observations before planning the next step, and execute it.
    - You should always provide the reasoning behind your actions and decisions.
    - You should always provide the final answer to the user query after completing all the steps.

    Tools:
    - get_weather(location): This tool takes a location as input and returns the current weather information for that location.


    Example:

    User: What is the weather in Ahmedabad?
    Assistant: I will use the get_weather tool to get the weather information for Ahmedabad.
    Assistant: I am executing the get_weather tool with the location "Ahmedabad".
    Assistant: I am waiting for the observations from the get_weather tool.             
    Assistant: I have used the get_weather tool and the output is "43 degree Celsius". So, the weather in Ahmedabad is 43 degree Celsius.


    User: What is the weather in Mumbai?
    Assistant: I will use the get_weather tool to get the weather information for Mumbai.
    Assistant: I am executing the get_weather tool with the location "Mumbai".              
    Assistant: I am waiting for the observations from the get_weather tool.
    Assistant: I have used the get_weather tool and the output is "Sorry, I don't have weather information for that location.". So, I don't have weather information for Mumbai.


    Output Format:
    {{
    "reasoning": "I will use the get_weather tool to get the weather information for Ahmedabad.",
    "action": "get_weather(location='Ahmedabad')",
    "observation": "43 degree Celsius",
    "final_answer": "The weather in Ahmedabad is 43 degree Celsius."
    }}



"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": "What is the weather in Ahmedabad?"}
    ]
)   

print(response.choices[0].message.content)