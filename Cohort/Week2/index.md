Template literal at parse time:
─────────────────────────────────────
`Hello, ${firstName}! You have ${count} new messages.`
│ │ │
│ └── Expression 1 └── Expression 2
└── Static text fragments: ["Hello, ", "! You have ", " new messages."]

At runtime:
──────────────────────────────────────
Static[0] + eval(Expr1) + Static[1] + eval(Expr2) + Static[2]
"Hello, " + "Priya" + "! You have " + "3" + " new messages."

Result:
──────────────────────────────────────
"Hello, Priya! You have 3 new messages."
