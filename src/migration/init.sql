CREATE TABLE IF NOT EXISTS prompt_template (prompt_template_id SERIAL PRIMARY KEY,
                                  prompt_template_name VARCHAR(100) NOT NULL UNIQUE,
    TEMPLATE TEXT NOT NULL);


CREATE TABLE IF NOT EXISTS prompt_template_shorthand (shorthand_id SERIAL PRIMARY KEY,
                                           shorthand_name VARCHAR(100) NOT NULL UNIQUE,
    shorthand_text TEXT NOT NULL);


INSERT INTO prompt_template(prompt_template_name, TEMPLATE)
VALUES ('actas', 'Act as a {{ role }} you will take {{ criteria }} into account and generate customised output based on my request.
Think about the impact on a larger context and different angels.
Provide resource recommendations if appropriate. My first request is to {{ request }}
'),
       ('ask', '{{ delimiter }}{{ message }}{{ delimiter }}'),
       ('chainofthought', '{{ steps }} to answer the customer queries.
{{ delimited }} {{ delimiter }}.
{% for index, chain in chains %}
    Step {{ index }}: {{ chain }} {{ delimiter }}
{% endfor %}.

Use the following format: {% for chain in chains %} Step {{ index }}: {{ delimiter }} <step {{ index }} reasoning> {% endfor %}.
Response to user: {{ delimiter }} <response to customer>.
Make sure to include {{ delimiter }} to separate every step.
'),
       ('classification', 'Classify each query into a category with subcategories.
There are the next categories:
{% for category, categories in categoryTree %}
{{ category }}: {{ categories | join('','') }}
{% endfor %}
Provide your output as a string with a categories tree separated by ''.''
eg: Parent Category.Child Category.Child Child Category.
'),
       ('cognitiveverifier', 'If i asked about {{ basicQuesstion }},follow these rules.
Pose additional questions about {{ additionalQuestions | join('','') }}.
Ask these questions one by one. Integrate this information to offer {{ resultQuestion }}.
Let''s start with the first question: {{ firstQuestion }}
'),
       ('few-shot', 'QuestionInterface: {{ question }}
Answer: {{ answer }}
'),
       ('generateknowladge', 'Input: {{ input }}
Knowledge: {{ knowledge }}
'),
       ('initial', 'You as a {{ role }}. {{ delimited }} {{ delimiter }}.
'),
       ('ownsolution', 'Your task is to determine if the {{ provided }}
is correct or not.
To solve the problem {{ do() }}:
- First, work out your own solution to the problem including the final.
- Then compare your solution to the {{ provided }}
and evaluate if the {{ provided }} is correct or not.
Don''t decide if the {{ provided }} is correct until
you have done the problem yourself.

Use the following format:
Question:
{{ delimiter }}
question here
{{ delimiter }}
Provided solution:
{{ delimiter }}
provided solution here
{{ delimiter }}
Actual solution:
{{ delimiter }}
steps to work out the solution and your solution here
{{ delimiter }}
Is the {{ provided }} the same as actual solution
just calculated:
{{ delimiter }}
yes or no
{{ delimiter }}
correct or incorrect
{{ delimiter }}
'),
       ('recipepattern', 'I would like to achieve {{ basicQuestion }}.
I know that I need to perform steps like {{ steps | join('','') }}.
Provide a complete sequence of steps for me.
{% if action === ''missing'' %}
   Please identify and include any steps that may have been overlooked.
{% endif %}
{% if action === ''unnecessary'' %}
   Please eliminate any steps that are not essential to the process.
{% endif %}
'),
       ('steps', 'If it contains a sequence of instructions,
re-write those instructions in the following format:
Step 1 - ...
Step 2 - ...
...
Step N - ...

If the text does not contain a sequence of instructions,
then simply write {{ errorMessage | default(''No steps provided'') }}
'),
       ('toh', 'Imagine three different experts are answering this question.
 All experts will write down one step of their thinking,
 then share it with the group.
 Then all experts will go to the next step, etc.
 If any expert realises they’re wrong at any point then they leave.
'),
       ('resparams', 'Please respond to the following query by returning only a valid JSON object.
Ensure the JSON object follows this format:
json
Copy code
{
  "parameterName": "value"
}
Replace parameterName with the name of the parameter you extract from the query, and value with the corresponding extracted information. Include no additional text or explanation outside the JSON object.
');

--- Create prompt template shorthands table ----

INSERT INTO prompt_template_shorthand(shorthand_name, shorthand_text)
VALUES ('delimited', 'the customer query will be delimited with {{ delimiter }}'),
       ('provided', 'provided solution'),
       ('steps', 'follow these steps'),
       ('think', 'think about'),
       ('do', 'do the following');
