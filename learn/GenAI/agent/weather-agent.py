import requests
import json
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(api_key = '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')

def get_weather(city:str):
    url = f"https://wttr.in/{city}?format=%C+%t"
    response = requests.get(url=url)

    if response.status_code == 200:
        return f"The Weather in {city} is {response.text}"

    return "Something went wrong"


available_tools = {
    "get_weather":{
        "fn":get_weather,
        "descripiton": "take city name as input and return weather of that city"
    }
}


SYSTEM_PROMPT = f"""
You are a weather agent. You are responsible for providing weather information to the user.
You are given a question and you need to provide the weather information based on the question.


RULE:
 - Follow the output json format
 - Always perform one step at a time and wait for next input
 - Carefully analyse user query

OUTPUT JSON FORMAT:
{{
    "step":"string",
    "content":"string",
    "function":"name of the fucntion if step is function",
    "input":"string"
}}


Avaliable Tools: 
    - get_weather: take city name as input and return weather of that city   

Example
    User Query: What is weather of delhi ?
    Output: {{"step":"plan","content":"the user is instracted to knowign delhi wather data"}}
    Output: {{"step":"plan","content":"from avaliable tool I shood call get_weather"}}
    Output: {{"step":"action","function":"get_weather","input":"delhi"}}
    Output: {{"step":"observe","content":"12 degree cell."}}
    Output: {{"step":"output","content":"The weather of delhi is seem to be 12 degree cell."}}

    User Query: What is weather of mumbai ?
    Output: {{"step":"plan","content":"the user is instracted to knowign mumbai wather data"}}
    Output: {{"step":"plan","content":"from avaliable tool I shood call get_weather"}}
    Output: {{"step":"action","function":"get_weather","input":"mumbai"}}
    Output: {{"step":"observe","content":"20 degree cell."}}
    Output: {{"step":"output","content":"The weather of mumbai is seem to be 20 degree cell."}}


"""

messages= [
     {"role":"system","content": SYSTEM_PROMPT},
]

user_query = input('> ')
messages.append({"role":"user","content":user_query})
while True:
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format ={"type":"json_object"},
        messages=messages
    )

    parse_output = json.loads(response.choices[0].message.content)
    messages.append({"role":"assistant","content":json.dumps(parse_output)})

    if parse_output.get("step") == "plan":
        print(f"OP: {parse_output.get('content')}")
        continue

    if parse_output.get("step") == "action":
        tool_name =  parse_output.get("function")
        tool_input = parse_output.get("input")

        if available_tools.get(tool_name,False):   
            output = available_tools[tool_name].get("fn")(tool_input)
            messages.append({"role":"assistant","content":json.dumps({"step":"observe","content":output})})
            continue

    if parse_output.get("step") == "output":
        print(f"OP: {parse_output.get('content')}")
        break
