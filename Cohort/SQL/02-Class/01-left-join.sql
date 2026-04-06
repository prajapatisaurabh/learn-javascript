CREATE TABLE students (
student_id SERIAL PRIMARY KEY,
name VARCHAR (100),
email VARCHAR (100),
branch VARCHAR (50)
) ;


CREATE TABLE internships (
internship_id SERIAL PRIMARY,
company_name VARCHAR (100),
role VARCHAR (50),
stipend INT CHECK (stipend > 1000),
status VARCHAR (20) -- Selected / Pending / Rejected
) ;