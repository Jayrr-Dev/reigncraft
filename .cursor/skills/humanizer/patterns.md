# Humanizer pattern reference

Detailed before/after examples for each AI writing tell. The agent reads this file when humanizing long or heavily AI-sounding text.

---

## Content patterns

### 1. Undue emphasis on significance

**Watch:** stands/serves as, testament, pivotal/key/crucial, underscores, broader trends, evolving landscape, indelible mark

**Before:** The institute was established in 1989, marking a pivotal moment in the evolution of regional statistics in Spain.

**After:** The institute was established in 1989 to collect regional statistics independently from the national office.

### 2. Notability and media coverage

**Watch:** independent coverage, leading expert, active social media presence, outlet laundry lists

**Before:** Her views have been cited in The New York Times, BBC, Financial Times, and The Hindu.

**After:** In a 2024 New York Times interview, she argued that AI regulation should focus on outcomes rather than methods.

### 3. Superficial `-ing` analyses

**Watch:** highlighting, underscoring, symbolizing, reflecting, fostering, showcasing

**Before:** The palette resonates with the region's beauty, symbolizing bluebonnets and the Gulf, reflecting the community's connection to the land.

**After:** The architect chose blue and green to reference local bluebonnets and the Gulf coast.

### 4. Promotional language

**Watch:** boasts, vibrant, nestled, in the heart of, breathtaking, must-visit, groundbreaking, renowned

**Before:** Nestled within the breathtaking region of Gonder, Alamata Raya Kobo stands as a vibrant town with rich cultural heritage.

**After:** Alamata Raya Kobo is a town in the Gonder region, known for its weekly market and 18th-century church.

### 5. Vague attributions

**Watch:** industry reports, observers have cited, experts argue, some critics (without names)

**Before:** Experts believe the river plays a crucial role in the regional ecosystem.

**After:** A 2019 Chinese Academy of Sciences survey found several endemic fish species in the river.

### 6. Formulaic challenges sections

**Watch:** Despite its challenges, future outlook, continues to thrive

**Before:** Despite traffic and water issues, Korattur continues to thrive as an integral part of Chennai's growth.

**After:** Traffic worsened after three IT parks opened in 2015. The city started a stormwater drainage project in 2022.

---

## Language and grammar

### 7. AI vocabulary (high frequency)

**Watch:** additionally, align with, crucial, delve, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate, key (adj), landscape (abstract), pivotal, showcase, tapestry, testament, underscore, vibrant

**Before:** Additionally, camel meat is an enduring testament to the culinary landscape, showcasing Italian influence.

**After:** Somali cuisine includes camel meat. Pasta dishes from the Italian colonial period remain common in the south.

### 8. Copula avoidance

**Watch:** serves as, stands as, boasts, features (when "is" or "has" works)

**Before:** Gallery 825 serves as LAAA's exhibition space and boasts over 3,000 square feet.

**After:** Gallery 825 is LAAA's exhibition space. The gallery has four rooms totaling 3,000 square feet.

### 9. Negative parallelisms and tailing negations

**Before:** It's not just about the beat; it's part of the aggression. The options come from the item, no guessing.

**After:** The heavy beat adds to the aggressive tone. The options come from the selected item without forcing the user to guess.

### 10. Rule of three

**Before:** Keynotes, panels, and networking. Innovation, inspiration, and industry insights.

**After:** Talks and panels, plus informal networking between sessions.

### 11. Synonym cycling

**Before:** The protagonist faces challenges. The main character overcomes obstacles. The hero returns home.

**After:** The protagonist faces challenges, overcomes them, and returns home.

### 12. False ranges

**Before:** From the Big Bang to the cosmic web, from star birth to dark matter's dance.

**After:** The book covers the Big Bang, star formation, and dark matter theories.

### 13. Passive voice and subjectless fragments

**Before:** No configuration file needed. Results preserved automatically.

**After:** You do not need a configuration file. The system preserves results automatically.

---

## Style

### 14. Em and en dashes (hard ban in final output)

Replace with periods, commas, colons, parentheses, or restructure. Also catch `--` and spaced `—`.

**Before:** The term is promoted by Dutch institutions—not by the people themselves.

**After:** The term is promoted by Dutch institutions, not by the people themselves.

### 15. Boldface spam

**Before:** It blends **OKRs**, **KPIs**, and the **Business Model Canvas**.

**After:** It blends OKRs, KPIs, and tools like the Business Model Canvas.

### 16. Inline-header lists

**Before:** **User Experience:** improved. **Performance:** enhanced. **Security:** strengthened.

**After:** The update improves the interface, speeds up load times, and adds encryption.

### 17. Title case headings

**Before:** ## Strategic Negotiations And Global Partnerships

**After:** ## Strategic negotiations and global partnerships

### 18. Emojis in content

**Before:** 🚀 Launch Phase: Q3. ✅ Next Steps: follow up.

**After:** The product launches in Q3. Next step: schedule a follow-up.

### 19. Curly quotation marks

Use straight `"` and `'` in rewritten output.

---

## Communication artifacts

### 20. Chatbot correspondence pasted as content

**Watch:** I hope this helps, Of course!, Certainly!, Would you like..., let me know, here is a...

**Before:** Here is an overview of the French Revolution. I hope this helps!

**After:** The French Revolution began in 1789 when financial crisis and food shortages led to unrest.

### 21. Cutoff disclaimers and speculative gap-fill

**Watch:** as of my last update, while details are limited, maintains a low profile, likely grew up

**Before:** Details are not publicly available, suggesting she keeps a low profile. She likely grew up middle-class.

**After:** Her early life is not documented in available sources. (Or omit.)

### 22. Sycophantic tone

**Before:** Great question! You're absolutely right that this is complex.

**After:** The economic factors you mentioned are relevant here.

---

## Filler and hedging

### 23. Filler phrases

| Before                        | After           |
| ----------------------------- | --------------- |
| In order to achieve this goal | To achieve this |
| Due to the fact that          | Because         |
| At this point in time         | Now             |
| In the event that             | If              |
| has the ability to            | can             |
| It is important to note that  | (delete)        |

### 24. Excessive hedging

**Before:** It could potentially possibly be argued that the policy might have some effect.

**After:** The policy may affect outcomes.

### 25. Generic positive conclusions

**Before:** The future looks bright. Exciting times lie ahead on their journey toward excellence.

**After:** The company plans to open two more locations next year.

### 26. Hyphenated pair overuse

Keep hyphens in attributive position (`a high-quality report`). Drop them in predicate position when natural (`the report is high quality`).

### 27. Persuasive authority tropes

**Watch:** the real question is, at its core, what really matters, fundamentally, the heart of the matter

**Before:** The real question is whether teams can adapt. At its core, readiness matters.

**After:** The question is whether teams can adapt. That mostly depends on organizational readiness.

### 28. Signposting

**Watch:** let's dive in, here's what you need to know, without further ado

**Before:** Let's dive into how caching works. Here's what you need to know.

**After:** Next.js caches data at the request, data, and router layers.

### 29. Fragmented headers

**Before:** ## Performance / Speed matters. / When users hit a slow page, they leave.

**After:** ## Performance / When users hit a slow page, they leave.

### 30. Diff-anchored writing

Unless writing a changelog, describe the system as it is now.

**Before:** This function was added to replace the previous O(n²) approach.

**After:** This function uses a hash map for O(1) lookups.

### 31. Manufactured staccato drama

**Before:** Then it arrived. No preference for symmetry. No aesthetic prior. The old rules were gone.

**After:** It changed the search because it did not favor symmetry or human-looking designs.

### 32. Aphorism formulas

**Watch:** X is the Y of Z, X becomes a trap, the language/currency/architecture of

**Before:** Symmetry is the language of trust. Efficiency becomes a trap.

**After:** Symmetric layouts often feel more predictable. Teams can over-optimize and miss how people actually work.

### 33. Conversational rhetorical openers

**Watch:** Honestly?, Look,, Here's the thing, Let's be honest (as fake-candid hooks)

**Before:** Is it worth the price? Honestly? It depends on usage.

**After:** Whether it's worth the price depends on how often you'll use it.

---

## Full worked example

**Before (AI-sounding):**

> I recently spent five unforgettable days in Lisbon, and let me tell you — this city completely stole my heart. From the moment I arrived, I knew I was somewhere truly special.
>
> Nestled along the banks of the Tagus River, Lisbon stands as a vibrant testament to Portugal's enduring spirit, where rich history and modern energy intertwine at every turn. Yes, the famous hills are challenging — my legs certainly felt it! — but every climb rewards you with breathtaking, panoramic views that make it all worthwhile.
>
> No trip would be complete without riding the iconic Tram 28, winding through the city's most historic neighborhoods. And the food? Simply divine. The original pastéis de nata at Pastéis de Belém are a beloved national treasure, and savoring one still warm was a moment I will never forget.
>
> But what truly makes Lisbon special isn't just the sights — it's the feeling. Wander a few steps off the main squares and you'll discover a quieter, more authentic side: sun-drenched alleys, charming tiled facades, and friendly locals going about their daily lives, inviting you to slow down and savor every moment.
>
> Of course, the must-see São Jorge Castle offers stunning views over the rooftops below. The queues can be long, but the experience is absolutely worth it for any history buff or curious traveler.
>
> Would I go back? Absolutely. Lisbon isn't just a place to visit — it's a place to fall in love with, again and again. If you're dreaming of your next getaway, this is one destination that promises memories to last a lifetime. ✨

**Audit bullets (draft pass):**

- Still too compressed; drops texture instead of rewriting it
- Some sentences explain the point too cleanly
- Closer is flat

**Final:**

> I spent five days in Lisbon last October and still have mixed feelings about it. Beautiful, yes. Also harder on the knees than anyone warned me.
>
> The hills are the whole story and somehow never make the brochures. My hotel was up in Alfama, which photographs beautifully and translates, in practice, to climbing what felt like a six-story staircase every time I wanted coffee. By the second day my calves had opinions. I started planning each walk around which way was downhill, which is a strange way to see a city but probably an honest one.
>
> Everyone says to ride Tram 28, so I did, wedged against a stranger's backpack for forty minutes while three tour groups filmed the same corner. I would walk the route next time, or go before breakfast. The custard tarts, though, earn the fuss. I had one at a plain little place in Graça, still warm, and for about thirty seconds I understood why people build trips around pastry.
>
> What I did not expect was how quiet the city gets away from the main squares. Two blocks uphill from any plaza it turns into laundry lines, chipped tile, open windows, and old men watching football with the sound turned up. That is the Lisbon I keep thinking about, not the castle.
>
> The castle is fine. The view is great, the queue is long, and I spent more time shuffling toward the entrance than looking at anything once I got inside. If I had only two days, I would trade it for an afternoon of getting lost.
>
> I would go back, but in spring and with better shoes. Lisbon does not bend over backward to make things easy for you. I think I liked that, even when my legs disagreed.
