table = {}
matches = {}
mentees = {}
mentors = {}

for i in range(len(table)):
    if table[i].mentor:
        mentors[table[i].userid] = table[i].pairings
    else:
        mentees[table[i].userid] = table[i].pairings

for mentor, pref in mentors.items():
    for mentee in pref:
        if mentor in mentees[mentee]:
            try:
                matches[mentor].append(mentee)
            except:
                matches[mentor] = [mentee]
