/**
 * Seed Q&A Knowledge Base
 * Creates 100+ Q&A pairs across 5 categories
 * Run: npx ts-node --project tsconfig.json scripts/seed-qa.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// We'll use this as the author for seeded questions
const SEED_USER_ID = '00000000-0000-0000-0000-000000000001';

interface QAPair {
  title: string;
  content: string;
  category: 'family' | 'work' | 'spirituality' | 'health' | 'relationships';
  scholarly_perspective: string;
  contemporary_context: string;
  source_indices: number[]; // indices into sourcePool below
}

// Representative set of source citations we can reference
const SOURCE_CITATIONS = [
  'Surah Al-Isra 17:23-24',
  'Sahih Bukhari 1:1',
  'Sahih Muslim 1:1',
  'Al-Ghazali (1058-1111 CE)',
  'Imam Malik (711-795 CE)',
  'Ibn Taymiyyah (1263-1328 CE)',
  'Tirmidhi 1:1',
  'Abu Dawud 1:1',
  'Surah Al-Baqarah 2:255 (Ayat al-Kursi)',
  'Surah Al-Asr (Chapter 103)',
];

const qaPairs: QAPair[] = [
  // ─── FAMILY RELATIONS (20 questions) ───────────────────────────────────────
  {
    category: 'family',
    title: 'How should I handle disagreements with parents as a new Muslim?',
    content:
      'My parents are not Muslim and they sometimes disagree with my new lifestyle choices. How does Islam guide me in handling these conflicts respectfully?',
    scholarly_perspective:
      'Islam commands extraordinary respect for parents (Quran 17:23-24), even when they differ in faith. Scholars emphasize that a Muslim must obey parents in all matters except those that directly violate Islamic law. Maintaining kind speech and gentle conduct is obligatory. Ibn Kathir notes that accompanying parents with kindness in worldly matters is a Quranic command.',
    contemporary_context:
      'Family therapists and Muslim counselors observe that converts often face an adjustment period with family. Setting clear but loving boundaries, finding compromise on shared values, and regularly expressing love and gratitude help preserve relationships while living out Islamic convictions.',
    source_indices: [0, 1],
  },
  {
    category: 'family',
    title: 'Is it permissible to maintain ties with non-Muslim family members?',
    content:
      'After converting to Islam, should I continue visiting and maintaining relationships with my non-Muslim relatives?',
    scholarly_perspective:
      'Maintaining ties of kinship (silat al-rahim) is one of the most emphasized obligations in Islamic law. The Prophet (PBUH) strongly warned against cutting family ties. Scholars across all four madhabs agree that blood relations with non-Muslims are preserved. Islam does not permit abandoning family merely due to religious differences.',
    contemporary_context:
      'Converts who maintain active family relationships consistently report stronger personal wellbeing, easier navigation of their conversion journey, and greater opportunities for dawah through positive example. The key is to participate in family life while clearly and gently declining activities that conflict with Islamic practice.',
    source_indices: [1, 2],
  },
  {
    category: 'family',
    title: 'How do I explain Ramadan to my non-Muslim family?',
    content:
      'Ramadan is approaching and my family does not understand why I am fasting. How should I explain it to them?',
    scholarly_perspective:
      'Explaining one\'s religious practices with wisdom and good manners (Quran 16:125) is encouraged. The Prophet (PBUH) explicitly stated the spiritual objectives of Ramadan: self-purification, gratitude, and increased closeness to Allah. Scholars recommend patient, positive explanations that focus on the spiritual benefits rather than framing it as deprivation.',
    contemporary_context:
      'Many families, once they understand the purpose, become curious or even supportive. Sharing iftar meals with family is a beautiful bridge. Practical communication tips include explaining the schedule in advance, focusing on the spiritual and health benefits widely recognized by modern research, and asking for their support rather than demanding understanding.',
    source_indices: [0, 4],
  },
  {
    category: 'family',
    title: 'What does Islam say about marriage and choosing a spouse?',
    content:
      'As a new Muslim, I want to understand Islamic guidance on finding and choosing a spouse.',
    scholarly_perspective:
      'The Prophet (PBUH) advised prioritizing religious commitment (deen) in selecting a spouse, though beauty, lineage, and wealth are also mentioned as considerations (Sahih Bukhari). The Quran describes spouses as garments for one another (2:187), emphasizing mutual protection, comfort, and dignified partnership. Scholars require mutual consent and the presence of a wali (guardian) for the nikah.',
    contemporary_context:
      'Islamic marriage advisors recommend halal methods of meeting potential spouses: through family, community, or reputable matrimonial services. Chaperoned meetings allow proper evaluation. New Muslims are encouraged to take their time, seek guidance from trusted scholars or imams, and not rush due to social pressure.',
    source_indices: [1, 3],
  },
  {
    category: 'family',
    title: 'How should I approach celebrating non-Islamic holidays with family?',
    content:
      'My family celebrates holidays like Christmas and Thanksgiving. Am I allowed to participate?',
    scholarly_perspective:
      'Scholars differentiate between aqeedah-based celebrations (those affirming theological claims Islam rejects) and cultural family gatherings. Participating in family meals or gatherings without affirming their religious claims is a matter of scholarly difference. Many scholars permit attendance at family meals while abstaining from ritual elements. Ibn Taymiyyah\'s position is strict; contemporary scholars like Sheikh Yusuf al-Qaradawi allow cultural participation.',
    contemporary_context:
      'Many converts find a balanced approach: attending family gatherings for the sake of family unity while clearly not participating in religious rituals. Bringing halal food, explaining their position kindly, and using the occasion to show Islamic values of family love typically strengthens family relationships.',
    source_indices: [5, 2],
  },
  {
    category: 'family',
    title: 'What is my obligation to parents who are unsupportive of my conversion?',
    content:
      'My parents are angry about my conversion and have reduced contact. What does Islam say about my responsibilities toward them?',
    scholarly_perspective:
      'Quranic obligation to parents (Quran 17:23-24, 31:14-15) does not diminish based on their attitude or religion. Scholars emphasize that patience and continued kindness toward hostile parents is an act of worship. The Companion Asma\' bint Abi Bakr maintained a relationship with her pagan mother at the Prophet\'s explicit instruction.',
    contemporary_context:
      'Muslim counselors advise: continue reaching out with patience and without expectation of immediate acceptance; use practical acts of love (visiting, calling, helping); join convert support networks who understand this specific challenge; give family time to process the change, which may take years.',
    source_indices: [0, 1],
  },
  {
    category: 'family',
    title: 'Can I attend non-Muslim religious ceremonies with family?',
    content:
      'My sister is getting married in a church ceremony. Can I attend to support her?',
    scholarly_perspective:
      'Scholars distinguish between attendance (physical presence) and participation (affirming religious rites). Many contemporary scholars permit attending family religious ceremonies as a witness without affirming the theological claims. The principle of maintaining family ties and not causing unnecessary harm to family relations is cited. A minority of scholars advise complete avoidance.',
    contemporary_context:
      'A practical approach adopted by many converts: attend but refrain from making gestures of religious affirmation (kneeling, reciting creeds, receiving communion). Sitting respectfully and quietly is generally seen as acceptable. Discuss this with a local imam beforehand for guidance specific to your situation.',
    source_indices: [5, 4],
  },
  {
    category: 'family',
    title: 'How do I handle pressure from family to leave Islam?',
    content:
      'My family is putting significant pressure on me to give up Islam. How should I respond?',
    scholarly_perspective:
      'The Quran explicitly addresses pressure to abandon Islam: "There shall be no compulsion in religion" (2:256) applies both ways. Maintaining one\'s faith under family pressure is considered an act of great reward. The early Muslims faced severe persecution from their own families, and their steadfastness is held as the highest model.',
    contemporary_context:
      'Muslim counselors recommend: maintain respectful but firm communication about your commitment; seek emotional support from the Muslim community and convert networks; never argue theology under emotional pressure — defer to calm, separate conversations; distinguish between pressure that comes from love and concern versus genuine hostility, and respond accordingly.',
    source_indices: [2, 5],
  },
  {
    category: 'family',
    title: 'What does Islam say about respecting elders?',
    content:
      'How does Islam view respect for elders, including non-Muslim elders and community members?',
    scholarly_perspective:
      'Respect for elders is a fundamental Islamic value. The Prophet (PBUH) said: "Whoever does not show mercy to our young ones and does not acknowledge the honor due to our elderly is not one of us." Scholars indicate this applies broadly, not only to Muslim elders. Al-Ghazali dedicates extensive discussion to the proper conduct toward elders in Ihya Ulum al-Din.',
    contemporary_context:
      'This Islamic value aligns well with many cultural traditions and can serve as a bridge with non-Muslim family members who share similar cultural values. Demonstrating heightened respect for family elders after conversion can powerfully address the common fear that Islam will make someone cold or distant.',
    source_indices: [3, 2],
  },
  {
    category: 'family',
    title: 'How should a convert handle inheritance from non-Muslim parents?',
    content:
      'My non-Muslim parents have included me in their will. Is it permissible to receive an inheritance from them?',
    scholarly_perspective:
      'The classical ruling among the four major schools is that Muslims and non-Muslims do not inherit from each other under Islamic succession law. However, this applies to Islamic estates. There is no prohibition on receiving gifts, bequests, or inheritance under the laws of non-Muslim countries. Many contemporary scholars, including the Fiqh Council of North America, distinguish between Islamic inheritance rules and civil law inheritance.',
    contemporary_context:
      'Most Islamic scholars practicing in the West advise that accepting civil inheritance from non-Muslim parents is permissible, as Islamic inheritance laws were not designed to apply in non-Muslim legal jurisdictions. Consult a local scholar for guidance specific to your country\'s laws and your family situation.',
    source_indices: [4, 5],
  },
  {
    category: 'family',
    title: 'How do I discuss my prayer schedule with non-Muslim family members?',
    content:
      'I need to pray five times daily but my family finds it inconvenient during family activities. How do I handle this?',
    scholarly_perspective:
      'The five daily prayers are one of the five pillars of Islam and are obligatory. Scholars indicate that while the exact minute of prayer can sometimes be adjusted within the prayer\'s window, the prayer itself cannot be abandoned. The Prophet (PBUH) taught that prayer is the first thing a person will be held accountable for on the Day of Judgment.',
    contemporary_context:
      'Practical strategies: explain your prayer schedule in advance; prayers typically take 5-10 minutes, making it easier to step away briefly; combining prayers when traveling (with scholarly permission) helps during family trips; use prayer as an opportunity to show non-Muslim family a positive example of discipline and mindfulness.',
    source_indices: [1, 6],
  },
  {
    category: 'family',
    title: 'What are Islamic guidelines for raising children in a mixed-faith household?',
    content:
      'I am Muslim but my spouse has not yet converted. How do we approach raising children with different religious values at home?',
    scholarly_perspective:
      'Islamic jurisprudence generally expects Muslim parents to raise children in Islam. Scholars note the Prophetic emphasis on guiding children toward faith from an early age. In mixed households, many contemporary scholars advise prioritizing Islamic education and practice while maintaining respect for the non-Muslim parent\'s relationship with the children.',
    contemporary_context:
      'Muslim family counselors recommend: clear, early agreement with the spouse on religious education; exposing children to Islamic rituals naturally; connecting children with the Muslim community; and demonstrating Islamic values through everyday behavior. This situation requires ongoing dialogue and is best navigated with the help of a Muslim family counselor or imam.',
    source_indices: [0, 3],
  },
  {
    category: 'family',
    title: 'Can I visit the graves of my non-Muslim relatives?',
    content:
      'My grandmother who was not Muslim has passed away. May I visit her grave?',
    scholarly_perspective:
      'Scholars permit visiting the graves of non-Muslim relatives. The Prophet (PBUH) himself visited the grave of his mother, Aminah, and wept. However, praying for their forgiveness (istighfar) is not permissible after their death in the state of shirk, according to Quran 9:113. The visit itself for the purpose of reflection and maintaining family memory is permitted.',
    contemporary_context:
      'Visiting graves is consistent with Islamic practice of remembrance of death (dhikr al-mawt). Many converts find it helpful to visit graves of deceased relatives as a way of maintaining family bonds and personal reflection. You can make du\'a for divine mercy and guidance for yourself during the visit.',
    source_indices: [2, 1],
  },
  {
    category: 'family',
    title: 'How does Islam view adoption?',
    content:
      'I am interested in adopting a child. What is the Islamic perspective on adoption?',
    scholarly_perspective:
      'Islam does not recognize formal adoption in the Western legal sense (where the child takes the new family\'s surname and inherits as a biological child). However, fostering and caring for orphans is one of the most highly praised acts in Islam. The Quran (33:4-5) clarifies that adopted children retain their lineage. Care for orphans is specifically praised in Hadith collections.',
    contemporary_context:
      'Many Muslim families choose kafala (Islamic guardianship) rather than legal adoption, which can coexist in many Western legal systems. Some contemporary scholars allow various forms of legal adoption while maintaining Islamic lineage rules. Muslim adoption agencies can guide families through both the religious and legal aspects of this process.',
    source_indices: [1, 5],
  },
  {
    category: 'family',
    title: 'What does Islam say about caring for aging parents?',
    content:
      'My parents are getting older and may need care. What does Islam say about my responsibility?',
    scholarly_perspective:
      'Caring for aging parents is one of the highest obligations in Islam. The Quran (17:23) commands that when parents reach old age, one must not even say "ugh" to them and must speak to them with respect. The Prophet (PBUH) declared that obedience to parents is the second greatest deed after prayer. Scholars describe turning parents away in old age as a major sin.',
    contemporary_context:
      'In contemporary Muslim communities, balancing filial care with modern realities (geographic distance, work, one\'s own family) requires practical planning. Many Muslim scholars consider financial support, regular visits, and ensuring quality care to be acceptable ways of fulfilling this duty when direct cohabitation is not possible.',
    source_indices: [0, 3],
  },
  {
    category: 'family',
    title: 'Is it permissible to give gifts to non-Muslim family members on their holidays?',
    content:
      'My family celebrates Christmas and birthdays. Is it permissible to give them gifts on these occasions?',
    scholarly_perspective:
      'Gift-giving to non-Muslims is generally permissible and encouraged as a means of maintaining good relations. The Prophet (PBUH) himself gave and received gifts from non-Muslims. Scholars distinguish between gifts that celebrate religious claims (crosses, religious icons) and neutral or practical gifts. The majority view permits giving practical gifts to maintain family bonds.',
    contemporary_context:
      'Many contemporary Muslim scholars, including Sheikh Yusuf al-Qaradawi, permit giving gifts to non-Muslim family members during their holiday seasons as a gesture of love and family connection, provided the gift itself does not affirm beliefs that contradict Islam. Choosing neutral, practical gifts is the common recommendation.',
    source_indices: [1, 4],
  },
  {
    category: 'family',
    title: 'How should I handle family expectations about gender interactions?',
    content:
      'My family has mixed-gender gatherings where men and women freely mingle. How do I navigate this?',
    scholarly_perspective:
      'Islamic guidelines on gender interaction (lowering the gaze, avoiding unnecessary physical contact, maintaining modesty) are intended for public and social life. Scholars acknowledge that family gatherings with mahram (permitted relatives) involve different rules than interactions with non-mahram strangers. Brief, necessity-based interactions are generally permitted across most scholarly positions.',
    contemporary_context:
      'Muslim converts often navigate mixed-family gatherings by: maintaining their own modesty standards while not criticizing others; excusing themselves from activities they find uncomfortable; focusing on family conversation rather than physical interactions. Gradual education of family about Islamic norms, delivered with good humor, is often more effective than immediate demands for change.',
    source_indices: [4, 2],
  },
  {
    category: 'family',
    title: 'Can I request a nikah (Islamic marriage) if my family does not understand it?',
    content:
      'I want an Islamic marriage but my non-Muslim family does not understand what a nikah is. How do I approach this?',
    scholarly_perspective:
      'A nikah is a legal contract in Islam, not merely a religious ceremony. It requires an offer and acceptance, the presence of two Muslim witnesses, and a mahr (gift from groom to bride). Scholars indicate the ceremony itself can be brief and simple. The nikah can coexist with or precede a civil marriage ceremony required by law.',
    contemporary_context:
      'Many converts have successfully combined a simple nikah with a larger family celebration that the non-Muslim family can understand and participate in. Inviting an imam to briefly explain the nikah to the family often helps demystify the ceremony. Focus on the shared value of formal commitment in marriage, which most families, regardless of religion, understand and appreciate.',
    source_indices: [1, 5],
  },
  {
    category: 'family',
    title: 'How do I handle a family member\'s illness or death in an Islamic way?',
    content:
      'A non-Muslim family member is seriously ill. How does Islam guide me in supporting them and handling the situation?',
    scholarly_perspective:
      'Visiting the sick is a right of brotherhood in Islam, and this extends to non-Muslims according to the Hadith. The Prophet (PBUH) visited a sick Jewish boy and invited him to Islam. During illness and approaching death, scholars recommend maintaining presence, offering comfort, and if the person is open, gently sharing the Shahada. After death, Muslims may participate in family mourning but not in religiously exclusive funeral rites.',
    contemporary_context:
      'Practical Islamic guidance includes: be fully present for the family; handle practical needs; make du\'a privately for the ill person\'s guidance; if the person is open to Islam and approaching death, gently and kindly mention the Shahada; after death, express condolences and participate in family grieving in a way consistent with your Islamic practice.',
    source_indices: [2, 3],
  },
  {
    category: 'family',
    title: 'How do I explain hijab to my non-Muslim family?',
    content:
      'I have started wearing hijab and my family is concerned. How should I explain this to them?',
    scholarly_perspective:
      'Hijab is a Quranic obligation (24:31, 33:59) understood by scholars as an act of worship and modesty. It is a personal, voluntary (from a divine command perspective) choice that represents the Muslim woman\'s relationship with Allah. Scholars emphasize that hijab is a statement of faith and modesty, not a sign of oppression.',
    contemporary_context:
      'When explaining hijab to family, focus on: it is your personal choice and an act of faith you take seriously; it is not a political or cultural statement; you feel more comfortable and confident wearing it; your faith and relationship with God is the motivator. Share positive stories of Muslim women who wear hijab professionally and socially. Family concerns often come from misunderstanding or worry about your wellbeing, both of which can be addressed with patient, open conversation.',
    source_indices: [0, 4],
  },

  // ─── WORK & CAREER (20 questions) ──────────────────────────────────────────
  {
    category: 'work',
    title: 'Is it permissible to work in a company that sells alcohol?',
    content:
      'I work in a grocery store or restaurant that sells alcohol as part of its products. Is my job halal?',
    scholarly_perspective:
      'Classical scholars prohibit direct involvement in the sale, serving, or transportation of alcohol as these are explicitly forbidden. However, working in an establishment where alcohol is sold but not being directly involved in alcohol transactions is a point of scholarly difference. Many contemporary scholars allow working in such environments (e.g., a supermarket) if alcohol is a minor part of the business and one\'s role does not involve handling it.',
    contemporary_context:
      'Practical guidance for Muslims in these situations: avoid direct handling of alcohol; if your job requires it, seek a role change; if the business is primarily non-alcoholic (like a grocery store) and alcohol handling can be declined, most scholars permit the employment. Consulting a local imam with knowledge of your specific situation is strongly advised.',
    source_indices: [5, 2],
  },
  {
    category: 'work',
    title: 'How do I handle prayer times at work without conflict?',
    content:
      'My five daily prayers often fall during work hours. How do I manage this professionally?',
    scholarly_perspective:
      'The five daily prayers are an absolute obligation in Islam. Scholars teach that prayer times cannot simply be "made up" — they must be performed within their windows (with some scholarly allowance for combining Dhuhr/Asr and Maghrib/Isha during travel or necessity). The obligation does not disappear for employment reasons.',
    contemporary_context:
      'Practically: formally request religious accommodation in writing (protected in many countries); Dhuhr and Asr prayers each take about 5-10 minutes; break times can often be used for Dhuhr; flexible scheduling helps; many employers, once informed, are accommodating. Proactively communicate with HR or management. Joining or forming a Muslim employee group at work is helpful where possible.',
    source_indices: [1, 6],
  },
  {
    category: 'work',
    title: 'What does Islam say about interest (riba) in banking?',
    content:
      'I need a loan for a house or car. How do I understand the Islamic prohibition on interest?',
    scholarly_perspective:
      'Riba (interest/usury) is among the most severely condemned practices in the Quran (2:275-278), with Allah declaring war on those who engage in it. The four major schools of Islamic law unanimously prohibit paying or receiving interest. Islamic finance provides alternatives: murabaha (cost-plus financing), ijara (leasing), and diminishing musharakah (partnership) are all Shariah-compliant alternatives.',
    contemporary_context:
      'Islamic banks and Islamic windows in conventional banks now operate worldwide. In countries where Islamic mortgages are unavailable, some contemporary scholars (notably Sheikh Yusuf al-Qaradawi under the principle of necessity) have issued opinions permitting conventional mortgages for home purchase under specific conditions. Consult a qualified Islamic finance scholar for guidance specific to your country.',
    source_indices: [5, 4],
  },
  {
    category: 'work',
    title: 'Can I work in a bank as a new Muslim?',
    content:
      'I currently work at a conventional bank. Is my job permissible in Islam?',
    scholarly_perspective:
      'Working in a conventional interest-based bank in roles that directly involve processing, facilitating, or documenting interest-bearing transactions is generally considered impermissible by scholars, based on the Hadith warning against writing, witnessing, and consuming riba. Administrative or IT roles that do not directly involve riba transactions are subject to scholarly difference.',
    contemporary_context:
      'Many Muslims work in Islamic banking departments of conventional banks. If you are in a directly riba-related role, scholars recommend beginning a process of transition to a different field or role while fulfilling your current contractual obligations. Islamic finance is a growing field with significant career opportunities.',
    source_indices: [5, 2],
  },
  {
    category: 'work',
    title: 'How do I request halal food options at work events?',
    content:
      'My company frequently holds catered events with non-halal food. How do I handle this professionally?',
    scholarly_perspective:
      'Consuming halal food is an Islamic obligation. Muslims must avoid pork, improperly slaughtered meat, alcohol, and other forbidden substances. Scholars advise that one should avoid consuming haram food even in social settings, as social pressure does not override divine prohibition.',
    contemporary_context:
      'Best practices: inform HR or event organizers of your dietary requirements in advance (this is normal practice for any dietary restriction); suggest halal options or offer to find a vendor; keep a small halal meal or snacks available as backup; attend events and participate fully, simply declining non-halal items; most professional environments are accommodating of religious dietary needs when informed proactively.',
    source_indices: [1, 3],
  },
  {
    category: 'work',
    title: 'Is it permissible to work in the entertainment industry?',
    content:
      'I work in film, TV, or music production. Is this permissible in Islam?',
    scholarly_perspective:
      'The permissibility of work in the entertainment industry is not uniform and depends heavily on the specific content. Work that involves producing content promoting immorality, explicit content, shirk, or other haram activities is not permissible. Work on educational content, documentaries, or wholesome entertainment is generally considered permissible. Music is itself a point of scholarly difference — the majority of classical scholars restrict musical instruments, while a minority permit them within limits.',
    contemporary_context:
      'Many Muslim professionals work in entertainment in roles involving production, editing, distribution, or administration without directly creating prohibited content. The principle is to evaluate your specific role and its contribution to the overall content. Seeking guidance from a scholar familiar with your specific creative field is strongly advised.',
    source_indices: [5, 2],
  },
  {
    category: 'work',
    title: 'How do I handle business dealings that involve uncertainty (gharar)?',
    content:
      'I am starting a business and want to ensure my contracts and dealings are halal. What is gharar?',
    scholarly_perspective:
      'Gharar refers to excessive uncertainty or ambiguity in contracts that can lead to dispute or exploitation. Islamic commercial law prohibits contracts with gharar: price, quantity, and delivery terms must be clear. Derivatives, certain insurance products, and speculative financial instruments are often cited as involving prohibited gharar. Standard commercial contracts with clear terms are permissible.',
    contemporary_context:
      'For practical business: ensure all contracts clearly specify price, delivery terms, and product/service description; avoid speculative transactions where the subject matter does not yet exist; for complex financial arrangements, consult an Islamic finance expert. Many Islamic legal bodies provide guidance on specific contract types for Muslim entrepreneurs.',
    source_indices: [4, 5],
  },
  {
    category: 'work',
    title: 'What does Islam say about trade and commerce ethics?',
    content:
      'How does Islam guide ethical behavior in business and trade?',
    scholarly_perspective:
      'Islamic commercial ethics are extensive. The Prophet (PBUH) was himself a merchant and modeled high standards: honesty, transparency, fair pricing, not concealing defects, and fulfilling contractual obligations. The Quran (83:1-3) strongly condemns those who cheat in weights and measures. Scholars consistently identify deception, fraud, and exploitation as major commercial sins.',
    contemporary_context:
      'The Islamic business ethic aligns with modern corporate social responsibility frameworks. Key practical principles: full disclosure of product/service defects; fair dealing with employees and suppliers; fulfilling contracts even when financially disadvantageous; avoiding price gouging in times of need; building a reputation for integrity that serves both the business and the Muslim community.',
    source_indices: [1, 3],
  },
  {
    category: 'work',
    title: 'How do I balance career ambitions with Islamic values?',
    content:
      'I want to advance my career but I am concerned about sacrificing my Islamic practice and values.',
    scholarly_perspective:
      'Islam does not discourage worldly ambition — seeking livelihood is itself an act of worship when done with correct intention (niyyah). The Quran (28:77) instructs believers to seek their share of this world while not neglecting their portion of the hereafter. Scholars teach that deen (religion) should not be sacrificed for dunya (worldly gain), but that professional success, pursued ethically, is a legitimate aspiration.',
    contemporary_context:
      'Muslim professionals consistently identify the following balance points: maintain the five daily prayers without compromise; set boundaries around Friday prayer; avoid career paths that require haram acts; give back to the community (zakat, sadaqa, volunteering); use career success as a platform for positive Islamic influence. Career planning that incorporates Islamic priorities from the beginning is far easier than retrofitting faith into an established career.',
    source_indices: [2, 3],
  },
  {
    category: 'work',
    title: 'Is network marketing (MLM) permissible in Islam?',
    content:
      'I have been invited to join a multi-level marketing or network marketing company. Is this allowed in Islam?',
    scholarly_perspective:
      'The permissibility of MLM is disputed among contemporary scholars. Issues include: if income primarily comes from recruiting rather than product sales, it resembles a pyramid scheme (prohibited as exploitation); if the product is overpriced compared to market value, it involves deception; if the business model creates necessary losers (as most MLM structures do), it may involve oppression. Many scholars express significant reservations about typical MLM structures.',
    contemporary_context:
      'Before joining any MLM: evaluate whether the products are competitively priced and genuinely useful; examine what percentage of participants actually profit from product sales vs. recruitment; research the company\'s regulatory history. If the business model primarily rewards recruitment over sales, most Islamic scholars would advise caution or avoidance.',
    source_indices: [5, 4],
  },
  {
    category: 'work',
    title: 'Can a Muslim woman work outside the home?',
    content:
      'As a Muslim woman, am I allowed to work professionally and have a career?',
    scholarly_perspective:
      'There is no Islamic prohibition on women working professionally. The Prophet\'s wife Khadijah (RA) was a successful businesswoman. Islam protects a woman\'s right to own property and conduct business independently. Scholars emphasize that work must not involve mixed-gender settings that compromise modesty, require impermissible dress, or substitute for essential family obligations, but work itself is fully permissible.',
    contemporary_context:
      'Muslim professional women occupy every field globally. The key considerations in Islamic scholarship involve: maintaining hijab and modesty standards; avoiding settings with excessive free mixing that compromise Islamic conduct; balancing professional and family responsibilities with one\'s husband (through mutual agreement). Many Muslim women in the West successfully navigate professional careers while maintaining their Islamic practice and identity.',
    source_indices: [1, 3],
  },
  {
    category: 'work',
    title: 'How should I handle workplace discrimination based on my religion?',
    content:
      'I have faced or am concerned about discrimination at work because of my Muslim identity. What does Islam say and what are my rights?',
    scholarly_perspective:
      'Islam commands seeking justice (adl) and standing up against oppression (zulm). The Quran (4:135) instructs Muslims to be upholders of justice. Suffering discrimination silently when one has recourse is not required. Seeking legal protection and redress is consistent with Islamic principles. Sabr (patience) refers to patience in the face of what cannot be changed, not passivity in the face of preventable injustice.',
    contemporary_context:
      'In most Western countries, religious discrimination in employment is illegal. Practical steps: document incidents clearly; report to HR formally; contact legal advocacy organizations such as CAIR (US) or Tell MAMA (UK); consult an employment attorney. Engaging professionally and with excellent work performance is the strongest long-term response to bias, while simultaneously pursuing legal remedies.',
    source_indices: [2, 5],
  },
  {
    category: 'work',
    title: 'Is day trading or stock market investment permissible?',
    content:
      'I am interested in investing in the stock market. What is the Islamic view on this?',
    scholarly_perspective:
      'Stock market investment in companies whose primary business is permissible is generally allowed by contemporary scholars. However, investing in companies whose primary business involves alcohol, gambling, tobacco, weapons, or interest-based finance is not permissible. Day trading involving excessive speculation may constitute gharar (prohibited uncertainty). Scholars from Fiqh councils have developed screening criteria for halal investment.',
    contemporary_context:
      'Islamic finance has developed significant infrastructure for halal investing: Islamic index funds (Dow Jones Islamic Index, S&P 500 Shariah), halal investment apps, and Islamic ETFs are widely available. These products use Shariah screening to exclude prohibited companies. For more complex questions about specific investments, consult an Islamic finance scholar.',
    source_indices: [5, 4],
  },
  {
    category: 'work',
    title: 'What does Islam say about paying zakat on business income?',
    content:
      'I run a small business. How do I calculate and pay zakat on my business assets?',
    scholarly_perspective:
      'Zakat on business is obligatory when business assets (goods for sale, cash, receivables) reach the nisab threshold (equivalent to 87.5g gold or 612.5g silver) and one lunar year has passed. The rate is 2.5% of zakatable assets. Scholars differ on whether to calculate on total assets or net assets (after liabilities). The Hanafi school calculates on the total value of goods held for trade.',
    contemporary_context:
      'Many Islamic organizations provide zakat calculators online. Key zakatable business assets: cash in hand and in accounts, inventory/goods for sale, trade receivables. Non-zakatable: fixed assets (equipment, buildings used in business). Paying zakat purifies wealth and is one of the five pillars of Islam. Consult a local sheikh or use a reputable Islamic organization\'s zakat calculator for accuracy.',
    source_indices: [1, 4],
  },
  {
    category: 'work',
    title: 'How do I handle required work travel during Ramadan?',
    content:
      'My job requires travel during Ramadan. How do I manage fasting and work obligations?',
    scholarly_perspective:
      'The Quran (2:184) explicitly permits breaking the fast during travel (safar) with the obligation to make up the missed days later. The classical definition of travel that permits this dispensation is a journey of approximately 80km or more. Scholars emphasize that this permission is a mercy from Allah and using it is not sinful — some scholars (Hanbali position) actually discourage fasting while traveling if it causes hardship.',
    contemporary_context:
      'Practical guidance for Muslim professionals during Ramadan travel: use the traveler\'s dispensation without guilt when traveling significant distances; maintain prayer schedule (combining and shortening prayers is also permitted during travel); inform colleagues and clients about Ramadan so they understand your energy levels; schedule demanding meetings during non-fasting hours when possible.',
    source_indices: [1, 2],
  },
  {
    category: 'work',
    title: 'What is the ruling on working in cybersecurity or hacking?',
    content:
      'I work in cybersecurity, including penetration testing. Is this permissible?',
    scholarly_perspective:
      'Defensive cybersecurity — protecting systems, data, and people from unauthorized access — is clearly permissible and socially beneficial. Penetration testing conducted with explicit permission from the system owner is analogous to legitimate security testing. Unauthorized access to systems, data theft, and enabling harm to others are clearly prohibited under Islamic principles of protecting private property (hifz al-mal) and avoiding harm (la darar wa la dirar).',
    contemporary_context:
      'The Islamic ethical framework for cybersecurity focuses on intent and authorization: work that protects people and systems is praiseworthy; work conducted with proper authorization to test and improve security is permissible; any work involving unauthorized access or enabling harm is prohibited. This field presents significant opportunities for Muslim professionals to serve the public good.',
    source_indices: [3, 5],
  },
  {
    category: 'work',
    title: 'Is it permissible to take on debt for education?',
    content:
      'I need student loans to complete my degree. How does Islam view education debt with interest?',
    scholarly_perspective:
      'Interest-bearing student loans are subject to the general prohibition on riba. However, scholars acknowledge the profound importance of education (Quran 96:1-5) and the social context in which many Muslims live. Several contemporary scholars and Islamic legal bodies have issued opinions permitting government student loans under necessity (darura) when no Islamic alternative is available, with the condition that one seeks Islamic alternatives first.',
    contemporary_context:
      'Practical options: some countries offer interest-free or income-contingent government loans; Islamic student finance is available in the UK through specific schemes; scholarships, employer education assistance, and part-time work while studying are halal alternatives. If forced to use a conventional loan, choose the lowest-interest option and repay as quickly as possible. Consult a local scholar for a fatwa specific to your situation.',
    source_indices: [5, 2],
  },
  {
    category: 'work',
    title: 'How should I respond to being asked to lie or deceive in my job?',
    content:
      'My employer sometimes asks me to be dishonest with clients. How does Islam guide me?',
    scholarly_perspective:
      'Honesty (sidq) is among the most fundamental Islamic virtues. The Prophet (PBUH) identified lying as a characteristic of hypocrites. Scholars are unanimous that employment cannot justify deception, fraud, or misleading clients. One cannot obey any created being in disobedience to the Creator. Refusing to engage in dishonesty, even at professional risk, is an Islamic obligation.',
    contemporary_context:
      'If instructed to lie to clients: first attempt to find an alternative approach that meets business goals without deception; clearly communicate your values to your manager; document the instruction; consider whether this is isolated or systemic. If lying is embedded in your role\'s requirements, this is a strong signal to begin seeking alternative employment. A Muslim\'s reputation for integrity can itself become a professional asset.',
    source_indices: [1, 3],
  },
  {
    category: 'work',
    title: 'What does Islam say about unions and collective bargaining?',
    content:
      'Should I join a labor union as a Muslim worker?',
    scholarly_perspective:
      'Islamic economics strongly supports justice for workers (ujara) and prohibits exploitation of labor. The Quran (83:1-3) condemns those who cheat in transactions, which scholars extend to employer-employee relations. Collective action to secure fair wages and working conditions is consistent with Islamic principles of preventing oppression and seeking justice. Scholars note that union involvement may become impermissible if it requires participating in haram activities (e.g., strikes that harm innocent people).',
    contemporary_context:
      'Many Muslim scholars view ethical union membership as consistent with Islamic values of worker justice. Key considerations: unions that secure fair wages, safe conditions, and non-discriminatory treatment align with Islamic principles; evaluate whether specific union activities (certain strikes, political activities) conflict with your values; contribute to improving conditions for all workers, which is itself a form of social charity in Islamic ethics.',
    source_indices: [2, 4],
  },
  {
    category: 'work',
    title: 'Can I work for a non-Muslim employer?',
    content:
      'Is it permissible to work for and take a salary from a non-Muslim employer or company?',
    scholarly_perspective:
      'There is no Islamic prohibition on working for non-Muslim employers. The Quran and Sunnah contain no such restriction. The Prophet\'s Companions worked in various capacities in communities where non-Muslims held economic power. What matters is that the work itself is permissible, the compensation is fair, and contractual obligations are fulfilled.',
    contemporary_context:
      'The vast majority of Muslims worldwide work for non-Muslim employers, often in majority non-Muslim countries. The Islamic requirement is that the work itself be halal, the pay be fair and earned through genuine service, and working conditions not compromise Islamic obligations (prayer, modesty, ethical conduct). A Muslim\'s excellent performance and ethical conduct in a non-Muslim workplace is itself a form of dawah.',
    source_indices: [1, 2],
  },

  // ─── SPIRITUALITY (20 questions) ───────────────────────────────────────────
  {
    category: 'spirituality',
    title: 'How do I strengthen my iman (faith) as a new Muslim?',
    content:
      'Some days my faith feels strong and other days I feel distant from Allah. How do I build and maintain strong iman?',
    scholarly_perspective:
      'Scholars teach that iman fluctuates — it increases with acts of obedience and decreases with sins and negligence. The Prophet (PBUH) described iman as having over 70 branches. Key practices that scholars consistently recommend for strengthening iman: regular Quran recitation with reflection (tadabbur); consistent dhikr; maintaining obligatory and optional prayers; seeking Islamic knowledge; righteous company; and reflecting on the signs of Allah in creation.',
    contemporary_context:
      'Spiritual peaks and valleys are universal among believers. Practically: identify your specific spiritual "dry spells" and their triggers (stress, sin, isolation from community); create daily Islamic rituals that anchor your practice; connect with the Muslim community for support; read the biographies of Companions who struggled and grew; consider journaling your spiritual journey as a form of reflection.',
    source_indices: [3, 1],
  },
  {
    category: 'spirituality',
    title: 'What is the proper way to perform salah (prayer)?',
    content:
      'As a new Muslim, I want to make sure I am performing the five daily prayers correctly.',
    scholarly_perspective:
      'The Prophet (PBUH) said: "Pray as you have seen me pray." Scholars have preserved the method of salah in extraordinary detail. The essential elements (arkan) are: purification (wudu or ghusl), facing the qibla, intention (niyyah), takbir al-ihram (opening Allahu Akbar), reciting Al-Fatiha, completing the positions (qiyam, ruku, sujud, tashahud), and taslim. Differences between the four schools are minor and all are valid.',
    contemporary_context:
      'New Muslims benefit greatly from: taking a structured salah class at a local mosque; using video tutorials from reputable Islamic sources; practicing with a Muslim mentor; using prayer apps for guidance on transliteration. Don\'t be discouraged by early mistakes — the Prophet (PBUH) corrected a man\'s prayer gently and repeatedly. Consistency matters more than perfection at the beginning.',
    source_indices: [1, 6],
  },
  {
    category: 'spirituality',
    title: 'How do I make my ibadah (worship) more sincere?',
    content:
      'Sometimes I go through the motions of Islamic worship but feel my heart is not present. How do I develop khushu (humility and focus) in worship?',
    scholarly_perspective:
      'Khushu (humility/focus) in prayer is strongly emphasized in the Quran (23:1-2). Al-Ghazali devotes an entire section of Ihya Ulum al-Din to developing presence of heart in worship. He identifies six key elements: presence of heart, understanding, reverence, awe, hope, and humility. Scholars teach that khushu develops through understanding what one recites, reflecting on the majesty of Allah, and gradually purifying the heart from distractions.',
    contemporary_context:
      'Practical techniques for developing khushu: learn the meanings of what you recite in salah; create a clean, quiet, dedicated prayer space; put away distractions before prayer; take a moment of reflection before beginning; slowly recite each verse with its meaning in mind; study books specifically about improving prayer quality such as "Khushu in Salah" by Ibn Rajab al-Hanbali.',
    source_indices: [3, 1],
  },
  {
    category: 'spirituality',
    title: 'What is the significance of reading the Quran daily?',
    content:
      'How important is daily Quran reading as a new Muslim, and how do I build this habit?',
    scholarly_perspective:
      'The Quran is described as a "guidance and mercy" (10:57) and a "healing for what is in the breasts" (10:57). The Prophet (PBUH) instructed that the Quran will intercede for its companions on the Day of Judgment. Scholars recommend daily Quran recitation, even if small amounts — the Prophet (PBUH) indicated that Allah is pleased even with the person who reads the Quran with difficulty. A daily wird (portion) is a Prophetic practice.',
    contemporary_context:
      'Building a daily Quran habit: start with just 5-10 minutes per day; use a transliteration if you cannot yet read Arabic; pair reading with translation to understand the meaning; use apps like Quran.com or Ayah by Ayah; link your Quran time to an existing daily habit (after Fajr prayer is the traditional time); track your progress with a Quran reading plan.',
    source_indices: [6, 1],
  },
  {
    category: 'spirituality',
    title: 'How do I overcome waswas (whispering doubts) in prayer?',
    content:
      'I often have intrusive thoughts and whispers during prayer that distract me. How do I handle this?',
    scholarly_perspective:
      'Waswas (whispering of Shaytan) in prayer is a well-documented spiritual challenge addressed by scholars extensively. The Prophet (PBUH) taught specific remedies: seeking refuge in Allah (reciting A\'udhu billahi min al-shaytan al-rajim), spitting softly to the left, and turning away from the intrusive thought. Ibn Taymiyyah wrote specifically about waswas, warning that excessive attention to it can become a spiritual disease (OCD-like scrupulosity).',
    contemporary_context:
      'Modern Muslim scholars and psychologists have addressed waswas in the context of OCD and anxiety. Key guidance: distinguish between normal distraction and clinical OCD; for normal waswas, gentle redirection of attention to prayer is sufficient; do not repeat actions excessively to "fix" waswas — this reinforces it; if waswas is causing significant distress or taking hours of your day, speak with a Muslim mental health professional.',
    source_indices: [5, 3],
  },
  {
    category: 'spirituality',
    title: 'What are the best duas (supplications) for a new Muslim?',
    content:
      'What are some important and powerful duas that I should learn as a new Muslim?',
    scholarly_perspective:
      'The Prophet (PBUH) taught numerous duas that cover every aspect of life. Scholars particularly emphasize: Al-Fatiha (the mother of the Quran, containing the essence of all du\'a); Dua Qunoot (supplication in witr prayer); morning and evening adhkar (remembrances); duas for entering and leaving the home, the mosque, the bathroom; and the comprehensive du\'a: "Allahumma inni as\'aluka al-jannah wa a\'udhu bika min al-nar."',
    contemporary_context:
      'For a new Muslim, the most practical approach: learn the duas that are part of daily prayers first (these are unavoidable and most important); then gradually add morning/evening adhkar; use a physical card or phone app to memorize two or three duas per month; focus on understanding the meaning of each du\'a you learn, not just memorizing the words. Hisnul Muslim (Fortress of the Muslim) is an excellent comprehensive dua collection.',
    source_indices: [1, 3],
  },
  {
    category: 'spirituality',
    title: 'How do I perform ghusl (ritual bath) correctly?',
    content:
      'I need to understand how to perform ghusl, particularly after sexual intercourse and in other situations that require it.',
    scholarly_perspective:
      'Ghusl is required after: sexual intercourse (whether or not there is ejaculation, upon union of two private parts); ejaculation due to any cause; completion of menstruation; completion of postpartum bleeding; and upon death (performed by those washing the deceased). The essential obligations of ghusl (upon which scholars agree): intention, water reaching all parts of the body including hair roots. The Prophetic method (ghusl al-sunnah) adds additional steps that are recommended (Sunnah) but not obligatory.',
    contemporary_context:
      'For practical guidance: ensure water thoroughly reaches all parts of the body, including under hair, behind ears, and between fingers/toes; start with washing hands and private parts, then make wudu, then pour water over the entire body; many scholars recommend using a small amount of water efficiently; after ghusl, you are in a state of taharah (ritual purity) and may pray. Take a class or consult a trusted Muslim mentor for a practical demonstration.',
    source_indices: [1, 4],
  },
  {
    category: 'spirituality',
    title: 'What is the difference between fard and sunnah acts?',
    content:
      'I keep hearing terms like fard, wajib, sunnah, and mustahabb. What do they mean?',
    scholarly_perspective:
      'Islamic legal categories (ahkam): Fard/Wajib (obligatory) — leaving it is a sin, performing it is rewarded; Sunnah/Mandub (recommended) — performing it is rewarded, leaving it is not sinful; Mubah (permissible) — neither rewarded nor punished; Makruh (disliked) — better to avoid but not sinful; Haram (forbidden) — leaving it is rewarded, doing it is sinful. (Note: Hanafi school distinguishes between fard and wajib; other schools use them interchangeably.)',
    contemporary_context:
      'Understanding these categories helps prevent two common mistakes: treating sunnah acts as obligatory (creating unnecessary rigidity) or treating fard acts as optional (leading to spiritual neglect). For new Muslims, focus first on fulfilling all fard obligations: five daily prayers, Ramadan fasting, paying zakat when applicable, and the testimony of faith. Add sunnah prayers and additional worship gradually.',
    source_indices: [4, 1],
  },
  {
    category: 'spirituality',
    title: 'How should I approach repentance (tawbah) in Islam?',
    content:
      'I have committed sins since becoming Muslim. How does tawbah work and how do I repent properly?',
    scholarly_perspective:
      'Tawbah (repentance) is one of the most beloved acts to Allah. The Quran (66:8) calls believers to "sincere repentance" (tawbah nasuh). Scholars identify four conditions for valid repentance: (1) ceasing the sin immediately; (2) genuine remorse; (3) firm resolve not to return to it; (4) if the sin involved another person\'s rights, rectifying or seeking forgiveness from them. The Prophet (PBUH) affirmed that "every son of Adam sins, and the best of those who sin are those who repent."',
    contemporary_context:
      'New Muslims especially benefit from understanding tawbah: Islam did not make you perfect — it gave you a path to return to Allah. Every sin is an opportunity to turn to Allah in humility. Practical tawbah: stop the sin; say: "Astaghfirullah wa atubu ilayh" (I seek Allah\'s forgiveness and return to Him); make a genuine commitment to change; follow the sin with a good deed. Do not let guilt paralyze you — Allah\'s mercy is greater than any sin.',
    source_indices: [3, 1],
  },
  {
    category: 'spirituality',
    title: 'What does Islam say about the remembrance of Allah (dhikr)?',
    content:
      'How important is dhikr and what are some practical ways to practice it?',
    scholarly_perspective:
      'The Quran commands believers to "remember Allah much" (33:41) and states "verily, in the remembrance of Allah do hearts find rest" (13:28). Scholars teach that dhikr is the foundation of the spiritual path. The Prophet (PBUH) recommended specific adhkar for morning and evening, after prayer, before sleeping, and throughout daily activities. Dhikr purifies the heart, increases iman, and draws one closer to Allah.',
    contemporary_context:
      'Building a dhikr practice: start with the post-prayer adhkar (33 times SubhanAllah, Alhamdulillah, Allahu Akbar); use a tasbih or phone app to track; connect dhikr to daily activities (say Bismillah before actions, Alhamdulillah after blessings, SubhanAllah when seeing beauty); morning and evening adhkar take about 10-15 minutes and provide comprehensive spiritual protection according to the Sunnah.',
    source_indices: [3, 1],
  },
  {
    category: 'spirituality',
    title: 'How do I learn to recite Quran in Arabic?',
    content:
      'I cannot read Arabic. How do I begin learning to recite the Quran properly?',
    scholarly_perspective:
      'The Quran was revealed in Arabic and is recited in Arabic in prayer. The Prophet (PBUH) said that one who reads the Quran while struggling with it receives double reward. Scholars have established the science of tajweed (rules of Quran recitation) to preserve the Quran\'s exact sounds as revealed. Learning from a qualified teacher (not just audio or video) is strongly recommended by scholars for correct tajweed.',
    contemporary_context:
      'Practical path for an Arabic-learning beginner: (1) Learn the Arabic alphabet using apps like Bayyinah TV or Iqra; (2) Begin with short surahs you hear in prayer; (3) Find a Quran tutor (many mosques offer this, or use online platforms like Quran Academy); (4) Practice daily even if just 10 minutes; (5) Be patient — many converts who started as adults have achieved beautiful Quran recitation through consistent practice.',
    source_indices: [6, 1],
  },
  {
    category: 'spirituality',
    title: 'What is the Islamic view on dreams and their significance?',
    content:
      'I sometimes have vivid dreams that feel spiritually meaningful. How does Islam view dreams?',
    scholarly_perspective:
      'The Prophet (PBUH) stated that true dreams (ru\'ya) are one part of 46 parts of prophethood. Scholars classify dreams into three types: (1) ru\'ya (true/good dreams from Allah); (2) hulum (desires of the nafs/ego); (3) whispers of Shaytan. Ibn Sirin compiled the earliest Islamic book on dream interpretation. Scholars caution against excessive attachment to dreams as guidance and emphasize that dreams cannot override Shariah.',
    contemporary_context:
      'Practical Islamic guidance on dreams: a good dream can be a source of comfort and gratitude; do not make major life decisions based solely on a dream; do not share a disturbing dream (share good dreams with trusted loved ones only); to ward off bad dreams, the Prophet (PBUH) taught seeking refuge in Allah from Shaytan and the evil of the dream and spitting softly to the left. Consulting a trained Islamic dream interpreter for significant dreams can be helpful.',
    source_indices: [3, 5],
  },
  {
    category: 'spirituality',
    title: 'How do I perform the night prayer (Qiyam al-Layl or Tahajjud)?',
    content:
      'I want to start praying at night. How do I perform Qiyam al-Layl and what is its significance?',
    scholarly_perspective:
      'Qiyam al-Layl (night standing) is one of the most praised optional acts in Islam. The Quran (17:79) commands the Prophet (PBUH) to perform it as an additional prayer. The Prophet (PBUH) said the best prayer after the obligatory prayers is the night prayer. It consists of a minimum of 2 rak\'at, can be extended as much as desired, and should conclude with witr prayer. The best time is the last third of the night.',
    contemporary_context:
      'Starting a Tahajjud habit: begin with just 2 rak\'at — do not set an initially unachievable target; set an alarm for 30-60 minutes before Fajr; start on weekends when you can sleep earlier; gradually increase as the habit develops. Many Muslims who establish Qiyam al-Layl describe it as the most spiritually powerful practice in their daily life. The quiet of the night and the intimacy of private prayer with Allah are unique spiritual experiences.',
    source_indices: [1, 3],
  },
  {
    category: 'spirituality',
    title: 'What is the significance of Jumu\'ah (Friday prayer)?',
    content:
      'Why is Friday prayer (Jumu\'ah) so important in Islam and what are its requirements?',
    scholarly_perspective:
      'Jumu\'ah is obligatory (fard) for every free, adult Muslim male who is a resident (scholars have different views on women\'s obligation — attending is rewarded but not obligatory for them). The Quran (62:9) commands believers to hasten to Friday prayer when called. The Prophet (PBUH) warned severely against missing three consecutive Jumu\'ah prayers without excuse. The khutbah (sermon) is integral to the prayer; the Jumu\'ah salah consists of two rak\'at preceded by the khutbah.',
    contemporary_context:
      'For working professionals, Jumu\'ah attendance requires planning: formally request religious accommodation from your employer (protected in many countries); schedule meetings away from the Jumu\'ah window (typically 12:30-1:30pm on Fridays, varying by location); find the nearest mosque with a time that works; use your lunch break. Many converts describe Jumu\'ah as a crucial weekly spiritual recharge and community connection.',
    source_indices: [7, 1],
  },
  {
    category: 'spirituality',
    title: 'How do I properly perform wudu (ablution)?',
    content:
      'What are the steps of wudu and what invalidates it?',
    scholarly_perspective:
      'The obligatory elements of wudu (Quran 5:6): washing the face, washing both arms to the elbows, wiping the head, and washing both feet to the ankles. The Sunnah additions include: beginning with intention, saying Bismillah, washing hands three times, rinsing the mouth and nose, wiping inside and outside the ears, and performing each action three times. Wudu is invalidated by: natural discharges (urine, stool, gas), sleep, losing consciousness, and touching private parts (with differences between schools).',
    contemporary_context:
      'New Muslims benefit from: taking a structured wudu class; practicing the steps daily until they become automatic; knowing that mastery comes with time; being aware that wudu facilities are available in many mosques, Islamic centers, and increasingly in airports and public spaces. Using a water bottle in the workplace bathroom for wudu is a common practical solution.',
    source_indices: [1, 4],
  },
  {
    category: 'spirituality',
    title: 'What is the Islamic view on seeking knowledge and education?',
    content:
      'How important is seeking religious and worldly knowledge in Islam?',
    scholarly_perspective:
      'The first word of Quranic revelation was "Iqra" (Read/Recite). The Prophet (PBUH) said seeking knowledge is obligatory for every Muslim. Scholars categorized knowledge into fard \'ayn (individually obligatory Islamic knowledge needed to practice the religion) and fard kifaya (collectively obligatory knowledge that includes worldly sciences). Al-Ghazali\'s Ihya begins with an extensive chapter on the virtue and types of knowledge.',
    contemporary_context:
      'A balanced Islamic approach to education: prioritize learning the basics of Islamic practice (prayer, dietary laws, Islamic ethics) as fard \'ayn; pursue worldly education and professional development with halal intentions; contribute your professional skills to the Muslim community and broader society; support Islamic educational institutions; the Muslim community needs engineers, doctors, lawyers, teachers — all fields can be pursued as worship with correct intention.',
    source_indices: [2, 3],
  },
  {
    category: 'spirituality',
    title: 'How do I observe the sunnah fasts beyond Ramadan?',
    content:
      'What are the recommended voluntary fasts in Islam and how do I incorporate them?',
    scholarly_perspective:
      'The Prophet (PBUH) recommended several voluntary fasts: six days in Shawwal (after Ramadan) — equivalent to fasting the whole year; Mondays and Thursdays — the Prophet (PBUH) fasted these regularly; the white days (13th, 14th, 15th of each lunar month); the day of Arafah (9th Dhul Hijjah) — expiates sins of two years; Ashura (10th Muharram) — expiates sins of one year. The Prophet (PBUH) said the best fast after Ramadan is fasting in the month of Muharram.',
    contemporary_context:
      'Building voluntary fasting into modern life: start with just two days per month on the white days; add a Monday or Thursday fast when comfortable; plan voluntary fasts during spiritually significant seasons; communicate your fasting schedule to family and colleagues to avoid awkward meal situations; use voluntary fasting as an opportunity for extra du\'a and Quran recitation.',
    source_indices: [1, 8],
  },
  {
    category: 'spirituality',
    title: 'What is the Islamic view on innovation in worship (bid\'ah)?',
    content:
      'I have heard that some Islamic practices are bid\'ah (innovation) and should be avoided. How do I understand this concept?',
    scholarly_perspective:
      'Bid\'ah linguistically means any novelty. In religious usage, it refers to introducing new acts of worship that the Prophet (PBUH) did not practice and did not intend as acts of worship, with the aim of getting closer to Allah. The Prophet (PBUH) warned against "every innovation is misguidance." However, scholars distinguish between bid\'ah in acts of worship (prohibited) and changes in worldly/administrative matters (generally permitted). The four schools and their scholars have disagreed on what specifically constitutes bid\'ah in many cases.',
    contemporary_context:
      'The bid\'ah debate is one of the most contested in contemporary Islamic discourse. Practically: focus your worship on clearly established Prophetic practices; approach new practices with scholarly inquiry rather than immediate adoption or rejection; consult reputable scholars from traditional schools; be aware that accusations of bid\'ah are sometimes misapplied to valid practices found in all historical schools of Islamic law.',
    source_indices: [5, 4],
  },
  {
    category: 'spirituality',
    title: 'How do I understand the concept of qadar (divine decree) in Islam?',
    content:
      'I struggle to understand qadar — how can everything be decreed by Allah while we still have free will?',
    scholarly_perspective:
      'Belief in qadar (divine decree) is the sixth pillar of faith (iman). Islamic theology establishes: Allah knows all things before they occur; He has recorded everything; His will is sovereign; yet humans have real will and choice and are responsible for their actions. The Ash\'ari and Maturidi schools (mainstream Sunni theology) affirm both divine decree and human responsibility, rejecting both fatalism and the denial of divine knowledge.',
    contemporary_context:
      'This is one of the deepest philosophical questions in Islamic theology. For practical faith: trust that what Allah has decreed is ultimately good, even when painful; take full responsibility for your choices and actions; use the concept of qadar as a source of psychological resilience (what is meant for you will reach you; what is not meant for you will not); never use qadar as an excuse for negligence or sin. The Prophet (PBUH) himself taught us to "tie your camel, then put your trust in Allah."',
    source_indices: [3, 5],
  },
  {
    category: 'spirituality',
    title: 'What is the purpose of the five pillars of Islam?',
    content:
      'As a new Muslim, I want to understand not just how to perform the five pillars but why they are important.',
    scholarly_perspective:
      'The five pillars (Shahada, Salah, Zakat, Sawm, Hajj) are the structural foundation of Muslim life. Scholars describe them as a comprehensive system of spiritual formation: the Shahada establishes the fundamental reality of existence; Salah creates daily, direct connection with Allah; Zakat purifies wealth and develops social consciousness; Sawm trains self-discipline and gratitude; Hajj unifies the global Muslim community and spiritually restores the soul.',
    contemporary_context:
      'Understanding the wisdom behind the pillars transforms them from mere obligations into meaningful practices. Each pillar addresses a different dimension of human need: Salah the need for divine connection; Zakat the need for social justice; Sawm the need for self-mastery; Hajj the need for universal community. Modern Islamic scholars have written extensively on the psychological and social benefits of each pillar as experienced by millions of Muslims globally.',
    source_indices: [3, 1],
  },

  // ─── HEALTH & WELLBEING (20 questions) ─────────────────────────────────────
  {
    category: 'health',
    title: 'What does Islam say about mental health and seeking therapy?',
    content:
      'I have been struggling with anxiety and depression. Is it permissible to see a therapist?',
    scholarly_perspective:
      'Seeking medical treatment is not only permissible but recommended in Islam. The Prophet (PBUH) said: "Make use of medical treatment, for Allah has not made a disease without appointing a remedy for it." Mental illness is a recognized illness — the early Muslim physician Ibn Sina (Avicenna) wrote extensively on psychological conditions. Seeking therapy is consistent with the Islamic obligation to preserve one\'s mind (hifz al-aql), one of the five Islamic objectives of divine law.',
    contemporary_context:
      'Contemporary Muslim scholars and organizations actively encourage mental health treatment. The Muslim Counsellors and Psychotherapists Network (UK) and Islamic counseling services globally provide faith-sensitive therapy. There is no shame in seeking psychological help; the Prophet (PBUH) himself experienced grief and sought comfort. Choose a therapist respectful of your religious values if possible, though general professional therapy is fully permissible.',
    source_indices: [3, 2],
  },
  {
    category: 'health',
    title: 'Is it permissible to take medication that contains alcohol?',
    content:
      'Some prescribed medications and syrups contain small amounts of alcohol. Can I take them?',
    scholarly_perspective:
      'The Islamic prohibition is on khamr (intoxicants) when consumed in quantities that intoxicate. Scholars have distinguished between alcohol as an intoxicant and alcohol in medication where: (1) the alcohol is not for intoxication; (2) there is no suitable halal alternative; (3) the amount is medically necessary. The majority of contemporary scholars permit taking prescribed medications with small alcohol content under these conditions, citing the principle of necessity (darura).',
    contemporary_context:
      'Practical guidance: if a halal alternative medication exists, choose it; if no alternative exists and the medication is medically necessary, most scholars permit using it; inform your doctor of your preference for alcohol-free formulations when possible — pharmacists can often provide alternative formulations. For non-essential medications (e.g., optional supplements or cosmetics containing alcohol), seek halal alternatives.',
    source_indices: [2, 4],
  },
  {
    category: 'health',
    title: 'How do I fast safely if I have a medical condition?',
    content:
      'I have diabetes (or another chronic condition). Can I still observe Ramadan fasting?',
    scholarly_perspective:
      'The Quran (2:184-185) explicitly permits Muslims who are ill to break the fast and make up the days later, or pay fidya (expiation) if they cannot make them up. Scholars universally agree that medical necessity exempts a person from fasting. The obligation to preserve life (hifz al-nafs) takes precedence over voluntary fulfillment of an obligation under conditions that endanger health. A doctor\'s advice that fasting is medically harmful creates an exemption.',
    contemporary_context:
      'For Muslims with chronic conditions: consult both your doctor and a knowledgeable Islamic scholar before Ramadan; many conditions can be safely managed during fasting with medication adjustment; the Islamic Medical Association of North America (IMANA) and UK Islamic Medical Association provide Ramadan health guides; many diabetic Muslims fast successfully with careful monitoring and medical guidance. Do not fast if your doctor genuinely advises against it — this is the Islamic ruling.',
    source_indices: [1, 2],
  },
  {
    category: 'health',
    title: 'What does Islam say about tattoos as a new Muslim?',
    content:
      'I got tattoos before converting to Islam. Are my previous tattoos a sin? Can I get more now?',
    scholarly_perspective:
      'The majority of scholars hold that permanent tattoos are prohibited in Islam, based on a Hadith in Sahih Bukhari and Muslim in which the Prophet (PBUH) cursed those who tattoo and those who are tattooed. For tattoos received before Islam, scholars are unanimous that sins committed before accepting Islam are forgiven — the person does not need to undergo painful removal if it causes hardship. Getting new tattoos after Islam is what is prohibited.',
    contemporary_context:
      'You have nothing to feel guilty about regarding tattoos received before Islam — your conversion erased previous sins. Practical guidance: do not get new permanent tattoos; if you have tattoos that appear during prayer and you are concerned about their coverage, the scholarly ruling is that tattoos do not invalidate wudu or salah; if you choose to remove tattoos, that is your personal decision but is not required. Many Muslims visibly display their pre-Islam tattoos without any religious obligation to remove them.',
    source_indices: [1, 5],
  },
  {
    category: 'health',
    title: 'Are there Islamic perspectives on exercise and fitness?',
    content:
      'How does Islam view physical exercise and maintaining health?',
    scholarly_perspective:
      'Islam strongly emphasizes maintaining health as a religious duty. The Prophet (PBUH) explicitly encouraged physical activities: swimming, archery, and horseback riding. He said: "A strong believer is better and more beloved to Allah than a weak believer." The preservation of one\'s body (hifz al-nafs) is one of the five objectives of Islamic law. Al-Ghazali and Ibn Sina both wrote on the importance of physical health for spiritual practice.',
    contemporary_context:
      'Exercise and fitness are fully encouraged in Islamic practice. Considerations for Muslim athletes: mixed-gender gym settings require maintaining modesty; women may prefer women-only facilities or workout at home; athletic clothing should maintain Islamic modesty standards when in public; exercise should not be prioritized over prayer obligations; using sport and physical ability as a means of dawah and community building is highly encouraged.',
    source_indices: [3, 2],
  },
  {
    category: 'health',
    title: 'Is it permissible to use cosmetics as a Muslim?',
    content:
      'I want to use makeup and skincare. What are the Islamic guidelines around cosmetics?',
    scholarly_perspective:
      'Islam permits personal beautification — the Prophet (PBUH) used kohl (antimony eye liner), oil in his hair, and henna. The Islamic restriction is that beautification worn publicly must be modest and not done for attraction of non-mahram men. Most scholars permit women to use cosmetics for their husbands and in female-only settings, and to use minimal cosmetics in public that do not draw excessive attention. Cosmetics must be checked for halal ingredients (no alcohol, pork derivatives, or haram substances).',
    contemporary_context:
      'The halal cosmetics industry has grown significantly. Practical considerations: check products for pork derivatives (gelatin, lard-derived emollients) and alcohol; many mainstream cosmetic brands now offer halal-certified lines; wudu-friendly products allow water to reach the skin through the product; excessive cosmetics in public (mixed-gender settings) is what scholars generally caution against, not cosmetics themselves.',
    source_indices: [1, 4],
  },
  {
    category: 'health',
    title: 'What does Islam say about abortion?',
    content:
      'What is the Islamic perspective on abortion in different circumstances?',
    scholarly_perspective:
      'Islamic positions on abortion vary based on timing. Scholars across all schools agree that abortion after ensoulment (120 days according to the majority; 40 days according to some) is severely restricted and generally prohibited except to save the mother\'s life. Before ensoulment, scholars differ: Hanafi and some other scholars permit abortion before 40 days under valid reasons; most other scholars restrict it even in early pregnancy. The sanctity of life (hifz al-nafs) is a core Islamic value.',
    contemporary_context:
      'For Muslims facing difficult pregnancy-related decisions, consulting a Muslim scholar with knowledge of contemporary medical realities is essential. Specific circumstances — medical conditions threatening the mother\'s life, severe fetal abnormalities, pregnancy resulting from assault — are each addressed differently by different scholars. These are among the most sensitive religious and personal decisions a person can face, and compassionate, qualified scholarly guidance is critical.',
    source_indices: [5, 2],
  },
  {
    category: 'health',
    title: 'How does Islam view organ donation?',
    content:
      'Should I sign up as an organ donor? What does Islam say about this?',
    scholarly_perspective:
      'Organ donation is a contemporary issue addressed by Islamic legal bodies. The Fiqh Council of North America and many Islamic jurisprudence bodies have issued rulings permitting organ donation based on the principle that saving a life (hifz al-nafs) is one of the highest Islamic objectives. Conditions scholars typically specify: the donation must be voluntary (not for profit); the donor must have consented; death must be confirmed according to proper criteria; organs should be donated to save lives.',
    contemporary_context:
      'Many Muslim scholars and the Islamic Medical Association of North America (IMANA) actively encourage Muslims to register as organ donors. The Islamic Society of North America (ISNA) endorses organ donation. Some individual scholars maintain caution or opposition, so you will find different opinions. Given the potential to save lives with your organs after death, the majority scholarly opinion leans toward permissibility and encouragement.',
    source_indices: [2, 3],
  },
  {
    category: 'health',
    title: 'Is yoga permissible in Islam?',
    content:
      'I enjoy yoga for fitness. Is it permissible to practice yoga as a Muslim?',
    scholarly_perspective:
      'Yoga as physical exercise (stretching, breathing, postures for fitness) is distinguished by contemporary scholars from yoga as a spiritual practice involving Hindu worship, meditation mantras, or spiritual "union" with concepts contrary to Islamic theology. The physical exercises themselves are permissible; the spiritual/religious elements are not. Scholars advise substituting Islamic remembrance (dhikr) for yoga\'s meditation elements.',
    contemporary_context:
      'Many Muslims practice yoga for its physical benefits while substituting any chants, mantras, or Hindu devotional elements with Islamic alternatives. "Halal yoga" or "Muslim yoga" communities exist that offer Islamic-friendly classes. The key distinction is between using physical techniques for health versus adopting associated spiritual or religious elements. Be especially mindful of the "spiritual" dimension of certain yoga traditions.',
    source_indices: [5, 3],
  },
  {
    category: 'health',
    title: 'What does Islam say about music and its effects on wellbeing?',
    content:
      'Music is a major part of my life. How does Islam view music, and how should I approach it as a new Muslim?',
    scholarly_perspective:
      'Music is one of the most debated topics in Islamic jurisprudence. The majority position of classical scholars (Hanafi, Shafi\'i, Hanbali) restricts most music, particularly instruments like stringed instruments and those associated with entertainment, singing, and dancing that lead to heedlessness. The Maliki school has a more permissive position on some music. Contemporary scholars are divided — some restrict all music beyond nasheeds (Islamic devotional songs), others permit music without explicit haram content.',
    contemporary_context:
      'This is a genuine area of scholarly difference — new Muslims should study multiple perspectives rather than immediately adopting the most permissive or most restrictive view. Practical guidance: music that evokes explicit haram content (sexuality, substance use, violence) is broadly agreed to be prohibited; nasheeds without instruments are broadly agreed to be permitted; music used therapeutically (for mental health treatment) has scholarly accommodations. Take this question to a trusted local scholar whose perspective you respect.',
    source_indices: [3, 5],
  },
  {
    category: 'health',
    title: 'What does Islam say about suicide and suicidal thoughts?',
    content:
      'I have been experiencing suicidal thoughts. What does Islam say, and where can I get help?',
    scholarly_perspective:
      'Islam strictly prohibits suicide (Quran 4:29: "Do not kill yourselves"). However, scholars are compassionate in their understanding that severe mental illness can overwhelm a person\'s will. The theological prohibition does not mean that those who struggle with suicidal thoughts are sinful or condemned — rather, Islam commands us to protect life and seek help. Mental illness is a genuine illness; struggling with it is not a character failing.',
    contemporary_context:
      'If you are experiencing suicidal thoughts, please reach out immediately: call a crisis line (988 in the US; 116 123 Samaritans in UK); reach out to a trusted Muslim mentor, imam, or family member; contact a Muslim mental health professional. Organizations like Lighthouse Arabia, Noor Human Consulting, and many mosque-based counseling services specifically serve Muslims in mental health crisis. You matter, your life has value, and help is available. Seeking help is an act of faith, not weakness.',
    source_indices: [3, 2],
  },
  {
    category: 'health',
    title: 'What is the Islamic view on vaccinations?',
    content:
      'I have heard some debate about whether vaccines are halal. What is the Islamic position?',
    scholarly_perspective:
      'The overwhelming consensus of Islamic legal bodies, scholars, and Muslim medical organizations is that vaccination is permissible and encouraged. The Prophet (PBUH) commanded seeking medical treatment. The Islamic Medical Association, Dar al-Ifta (Egypt), and virtually all mainstream scholarly bodies support vaccination. The principle of protecting life (hifz al-nafs) strongly supports preventive medicine. Concerns about specific haram ingredients in some vaccines are addressed on a case-by-case basis by scholars.',
    contemporary_context:
      'The COVID-19 pandemic brought this question to global attention. Virtually all major Islamic scholars and organizations issued rulings supporting vaccination. The principle of necessity (darura) and benefit to public health (which is a collective Islamic obligation, maslaha) strongly support vaccination. If you have concerns about specific vaccine ingredients, consult an Islamic scholar who has reviewed the specific formulation\'s composition.',
    source_indices: [2, 3],
  },
  {
    category: 'health',
    title: 'How does Islam address eating disorders and body image?',
    content:
      'I struggle with an eating disorder. How does Islam view this and can it help in recovery?',
    scholarly_perspective:
      'Islam commands moderation in eating. The Prophet (PBUH) advised filling one third of the stomach with food, one third with water, and leaving one third for air. Excessive restriction or excessive indulgence are both contrary to Islamic moderation (wasatiyyah). More importantly, the body is a trust (amanah) from Allah that must be properly cared for — harming the body through disordered eating falls under the prohibition of self-harm.',
    contemporary_context:
      'Islamic values can be powerful supports in eating disorder recovery: the concept that the body is a trust from Allah encourages its care; the prohibition on self-harm reframes restriction as contrary to Islamic teaching; community support from the Muslim community is a significant resource; Muslim therapists specializing in eating disorders can integrate Islamic spiritual frameworks with evidence-based treatment. Seeking professional help for eating disorders is fully supported in Islam.',
    source_indices: [3, 2],
  },
  {
    category: 'health',
    title: 'What does Islam say about sleep and rest?',
    content:
      'How does Islam view sleep? Is sleeping a lot considered lazy from an Islamic perspective?',
    scholarly_perspective:
      'Sleep is described in the Quran as a blessing from Allah (25:47). The Prophet (PBUH) had a consistent sleep schedule, taking an early sleep after Isha and waking for Tahajjud (night prayer) before Fajr. Classical scholars note that adequate sleep is necessary for the body and mind to function properly, which enables better worship. Excessive sleep, however, that causes one to miss prayers or neglect obligations is criticized.',
    contemporary_context:
      'The Prophet\'s sleep sunnah aligns remarkably with modern sleep science: early sleep (10pm-ish), 7-8 hours of sleep, an optional midday nap (qaylula) that research shows improves cognitive function and alertness. Muslims struggling with sleep disorders can approach treatment as fulfilling the Islamic obligation to maintain health. The concept of qaylula (midday rest) is a Prophetic sunnah with documented health benefits.',
    source_indices: [1, 3],
  },
  {
    category: 'health',
    title: 'Can a Muslim use medical marijuana or CBD?',
    content:
      'In my state/country, medical marijuana is legal. Can I use it for chronic pain if prescribed by a doctor?',
    scholarly_perspective:
      'The Islamic prohibition covers all intoxicants (khamr) — anything that clouds the mind or produces intoxication. Traditional marijuana, which produces intoxication, falls under this prohibition. CBD (cannabidiol) without THC content is not intoxicating and most scholars permit it for medical purposes. Medical marijuana that produces psychoactive effects is subject to scholarly debate — some permit it under strict medical necessity (darura) with no halal alternative, while the majority advise avoiding it due to the intoxication concern.',
    contemporary_context:
      'For chronic pain: first exhaust all non-intoxicating medical options; if THC-containing marijuana is the only effective treatment, consult a Muslim scholar with medical knowledge; pure CBD products are widely available and generally permitted; halal-certified pain management clinics and Muslim medical professionals can provide guidance that integrates Islamic and medical considerations. This is an area where continuing scholarly attention is needed as the science evolves.',
    source_indices: [2, 5],
  },
  {
    category: 'health',
    title: 'What does Islam say about vegetarianism and veganism?',
    content:
      'Is it permissible to be a vegetarian or vegan as a Muslim?',
    scholarly_perspective:
      'Vegetarianism and veganism are fully permissible in Islam — there is no obligation to eat meat. The Prophet (PBUH)\'s diet included many plant-based foods. Scholars note that while consuming halal meat is permitted, it is not obligatory. Some scholars note that the Quran specifically mentions the permissibility of eating meat (5:1), suggesting it is a personal choice within halal boundaries. A vegan diet automatically avoids many halal-haram concerns related to meat.',
    contemporary_context:
      'Many Muslims choose vegetarianism or veganism for health, environmental, or ethical reasons — all of which are consistent with Islamic values of health preservation and stewardship (khalifah) of creation. Halal vegan food is straightforwardly all plant-based food, with attention to alcohol in food processing, non-halal gelatin (which can appear in some plant-based products), and cross-contamination in shared facilities.',
    source_indices: [1, 2],
  },
  {
    category: 'health',
    title: 'How does Islam view intermittent fasting as a health practice?',
    content:
      'Is intermittent fasting for health benefits permissible and is it like Ramadan fasting?',
    scholarly_perspective:
      'Voluntary fasting for health purposes is supported by Islamic tradition. The Prophet (PBUH) regularly fasted on Mondays and Thursdays and described multiple types of voluntary fasts. The intention (niyyah) of a fast determines its spiritual value — fasting with dual intentions (spiritual benefit plus physical health) is valid and commendable. The Islamic fasting tradition predates modern intermittent fasting research by 1400 years.',
    contemporary_context:
      'Intermittent fasting research increasingly validates what Islamic fasting practice has always promoted: metabolic benefits, reduced inflammation, and improved mental clarity. Many Muslims have adopted intermittent fasting that aligns with their Sunnah fast days (Mondays, Thursdays, white days). Combining health and spiritual intention is encouraged. For medical conditions, consult your doctor before starting any fasting regimen.',
    source_indices: [1, 3],
  },
  {
    category: 'health',
    title: 'What is the Islamic stance on contraception?',
    content:
      'Is using birth control permissible in Islam?',
    scholarly_perspective:
      'Contraception is generally permissible in Islam with spousal agreement. The Prophet (PBUH)\'s Companions practiced \'azl (coitus interruptus) during his lifetime, and he did not prohibit it. Scholars of all four major schools permit reversible contraception when there is a valid reason (health, financial, family planning). Permanent sterilization without medical necessity is more contested among scholars, as it permanently closes a door that Islam generally leaves open.',
    contemporary_context:
      'All forms of reversible contraception (barrier methods, hormonal methods, IUDs) are generally permitted with mutual spousal consent. Emergency contraception that prevents implantation is subject to scholarly debate about when life begins. Permanent sterilization (tubal ligation, vasectomy) without compelling medical reasons is generally advised against but not universally prohibited. Consulting a Muslim scholar about your specific situation is advisable.',
    source_indices: [1, 4],
  },
  {
    category: 'health',
    title: 'What does Islam say about alcohol in foods and cooking?',
    content:
      'What foods should I watch out for that may contain alcohol or other haram ingredients?',
    scholarly_perspective:
      'The Quran prohibits khamr (intoxicants). Scholars have addressed the presence of trace alcohol in foods: alcohol used as a solvent in food production (vanilla extract, some flavorings) is subject to scholarly debate. The majority Hanafi position prohibits any food with detectable alcohol content, even trace amounts. Many other scholars permit trace alcohol in foods (below intoxicating levels) when used as a processing agent rather than as khamr. Gelatin from pork is prohibited; gelatin from beef slaughtered non-Islamically is subject to scholarly difference.',
    contemporary_context:
      'Practical food halal awareness: vanilla extract (contains alcohol) has both alcohol-free halal versions and is consumed by many Muslims who follow the "trace amounts" scholarly opinion; E-numbers (food additives) can include pig-derived gelatin; halal certification bodies in your country provide guidance on permissible products; apps like Scan Halal and Muslim Pro can help scan products for haram ingredients.',
    source_indices: [2, 4],
  },
  {
    category: 'health',
    title: 'How does Islam view plastic surgery and cosmetic procedures?',
    content:
      'Is plastic surgery or getting cosmetic procedures like Botox or fillers permissible?',
    scholarly_perspective:
      'Islamic scholars distinguish between: (1) Reconstructive surgery for genuine medical/psychological need (generally permissible); (2) Cosmetic surgery to correct a genuine defect causing psychological distress (permissible with conditions); (3) Cosmetic surgery for vanity or changing Allah\'s creation without necessity (prohibited, based on Quran 4:119 and Hadith warning against changing Allah\'s creation). Non-permanent procedures like Botox are treated more permissively by some scholars than permanent changes.',
    contemporary_context:
      'Contemporary scholars who have addressed cosmetic procedures: most permit rhinoplasty for genuine functional or psychological reasons; Botox for medical conditions (e.g., migraines) is permitted; Botox/fillers purely for vanity is debated; breast augmentation without medical reason is generally discouraged; procedures that restore function or address genuine disfigurement are broadly supported. Consult a trusted scholar with your specific situation before undertaking any cosmetic procedure.',
    source_indices: [5, 3],
  },
  {
    category: 'health',
    title: 'What does Islam say about smoking?',
    content:
      'Is smoking cigarettes or tobacco permissible in Islam?',
    scholarly_perspective:
      'Classical scholars initially classified tobacco as makruh (disliked) when it was first introduced to the Islamic world in the 16th century. As medical evidence of smoking\'s severe health harms became established, contemporary scholars overwhelmingly reclassified it as haram (prohibited). The Islamic Medical Association and most contemporary scholars cite: (1) clear harm to the body (hifz al-nafs); (2) waste of wealth; (3) harm to others through secondhand smoke; (4) addictive nature that diminishes will.',
    contemporary_context:
      'If you smoke, the Islamic perspective is clear: work toward cessation, which is itself an act of worship. Many mosques and Muslim organizations offer smoking cessation support. Medical cessation aids (nicotine patches, medications) are permissible. Smoking\'s haram status can be a powerful motivator for Muslim smokers seeking to quit. Sharing this rulings with smoking family members, while maintaining gentleness, can be a form of caring advice.',
    source_indices: [2, 3],
  },

  // ─── RELATIONSHIPS (20 questions) ──────────────────────────────────────────
  {
    category: 'relationships',
    title: 'How do I maintain friendships with non-Muslim friends?',
    content:
      'Since converting to Islam, how should I handle my existing friendships with non-Muslim friends?',
    scholarly_perspective:
      'Islam does not prohibit friendship with non-Muslims in its general sense. The Quran distinguishes between close alliance with those who actively oppose Muslims (prohibited) and ordinary friendly relations with non-Muslims who do not fight or persecute Muslims (fully permitted). The Prophet (PBUH) maintained relations with Jews and Christians in Medina, and his tribe\'s customary bonds of protection were honored.',
    contemporary_context:
      'Many converts find that their non-Muslim friendships can continue and even deepen after conversion. Key considerations: be honest with friends about your new lifestyle and what has changed; some activities (drinking, certain social settings) you will decline — communicate this without making friends feel judged; genuine friendships can accommodate religious difference; your example as a Muslim is itself the most powerful form of dawah.',
    source_indices: [2, 1],
  },
  {
    category: 'relationships',
    title: 'What does Islam say about dating before marriage?',
    content:
      'I had romantic relationships before Islam. What is the Islamic view on dating?',
    scholarly_perspective:
      'Islamic law does not permit the Western concept of dating (romantic, sexually involved relationship before marriage commitment). The prohibition on zina (adultery/fornication) and its approaches (khalwa — being alone with a non-mahram) form the basis. Scholars permit halal interaction for the purpose of marriage evaluation: chaperoned meetings, family-approved contact, and communication through appropriate channels with marriage as the explicit goal.',
    contemporary_context:
      'Many converts come from contexts where dating is the social norm and have previous relationship experience. Islam\'s position is to move toward marriage-focused interaction. Practical approaches for converts seeking marriage: use halal matrimonial services; allow family or a Muslim mentor to facilitate introductions; attend community events where meeting prospective spouses through proper channels is possible; be clear about your intentions to any potential partner.',
    source_indices: [1, 4],
  },
  {
    category: 'relationships',
    title: 'How should I handle romantic feelings before marriage?',
    content:
      'I have developed feelings for someone. How does Islam guide me in managing these feelings?',
    scholarly_perspective:
      'Scholars recognize that falling in love is a natural human experience. Islam channels this toward marriage rather than prohibiting the feeling itself. The Prophetic guidance for those who develop feelings for someone is to pursue marriage if it is possible and appropriate, and to guard oneself from haram if marriage is not immediately possible. The Prophet (PBUH) said: "We do not think that there is anything better for two who love each other than marriage."',
    contemporary_context:
      'Practical guidance: acknowledge your feelings without guilt — they are human and natural; assess whether marriage is possible and appropriate; if pursuing marriage, do so through halal channels (involving family or a trusted intermediary); guard yourself from situations that could lead to haram (avoid being alone together); if marriage is not possible at this time, protect yourself through increased worship, fasting, and avoiding situations that intensify the feelings.',
    source_indices: [1, 3],
  },
  {
    category: 'relationships',
    title: 'What is the Islamic concept of mahram?',
    content:
      'I keep hearing the term mahram in Islamic discussions. What does it mean and who qualifies?',
    scholarly_perspective:
      'Mahram refers to a person with whom marriage is permanently prohibited due to blood relation, nursing relation, or marriage. For a woman, her mahram are: father, son, brother, paternal uncle, maternal uncle, father-in-law (if married to his son), son-in-law (if married to his daughter), and milk-relations in the same categories. Marriage to mahram is forever prohibited. Khalwa (seclusion) with a non-mahram of the opposite gender is prohibited. The mahram concept protects family boundaries and social modesty.',
    contemporary_context:
      'Practically, the mahram concept becomes relevant in: women traveling long distances (scholarly views on whether a mahram is required for modern travel vary); male-female interactions at work and socially (non-mahram requires modesty and avoidance of seclusion); extended family gatherings (cousins are not mahram and Islamic modesty standards apply). The concept is not about distrust but about maintaining clear social boundaries that protect everyone.',
    source_indices: [4, 1],
  },
  {
    category: 'relationships',
    title: 'How do I navigate social events involving alcohol?',
    content:
      'I receive invitations to social events, parties, and gatherings where alcohol is served. How should I handle this?',
    scholarly_perspective:
      'Scholars distinguish between being present where alcohol is available and participating in alcohol consumption or service. The Hadith about the Prophet (PBUH)\'s condemnation of 10 types of involvement with khamr (the last being attending the gathering) is interpreted by scholars in its historical context. Most contemporary scholars permit attending events (weddings, work functions) where alcohol is served without consuming it or serving it, especially when declining would cause significant social or professional harm.',
    contemporary_context:
      'Practical navigation strategies: attend events, have a beverage (sparkling water, juice) in hand, and simply decline alcohol without making it a declaration; brief, non-judgmental declining ("I don\'t drink") works in most professional and social settings; events whose primary purpose is alcohol consumption (bar-centered gatherings) are more problematic; bring your own halal beverage to events where uncertain; if directly pressured, a simple, firm but friendly statement of your preference is sufficient.',
    source_indices: [2, 5],
  },
  {
    category: 'relationships',
    title: 'What does Islam say about interreligious marriages?',
    content:
      'I have fallen in love with someone of a different faith. What does Islam say about interreligious marriage?',
    scholarly_perspective:
      'Islamic law has specific rules on interreligious marriage: A Muslim man may marry a Muslim, Christian, or Jewish woman (People of the Book). A Muslim woman may only marry a Muslim man — all four schools agree on this. Marriage to polytheists, atheists, or those of other faiths is not permitted for either Muslim men or women. These rulings exist to protect Islamic practice within the family and ensure children are raised as Muslims.',
    contemporary_context:
      'This is often one of the most emotionally difficult questions converts face when they have an existing non-Muslim relationship. Many converts either encourage their partner to learn about Islam and potentially convert (which must be genuine), or face the painful choice between their relationship and their faith. A Muslim counselor or imam can provide compassionate, personalized guidance for these situations. The ruling itself is clear in Islamic law, though its application requires wisdom and care.',
    source_indices: [1, 5],
  },
  {
    category: 'relationships',
    title: 'How do I approach the concept of wali (guardian) for marriage?',
    content:
      'I am a Muslim woman interested in marriage. What is the role of a wali and who can serve as one for a convert?',
    scholarly_perspective:
      'The wali (marriage guardian) is required for the nikah in the Maliki, Shafi\'i, and Hanbali schools, while the Hanafi school requires the guardian\'s presence but less strictly. For a Muslim woman, the wali is ideally her father, then grandfather, then brother, then other male relatives. For a convert with no Muslim male relatives, most scholars permit the imam of her mosque to serve as her wali, as the Islamic community assumes this responsibility.',
    contemporary_context:
      'Converts marrying often face this practical challenge since their male relatives may not be Muslim. The recognized solution in most Muslim communities: the local imam formally serves as her wali; many mosques have formal wali services for convert sisters; Islamic organizations like the Muslim Marriage Guide provide guidance on this; the requirement is about a proper Islamic community process, not restricting the woman\'s agency — the woman retains full right to consent or refuse any proposed marriage.',
    source_indices: [4, 1],
  },
  {
    category: 'relationships',
    title: 'What are the rights and responsibilities in Islamic marriage?',
    content:
      'I am planning to get married soon. What are the Islamic rights and duties of husband and wife?',
    scholarly_perspective:
      'Islamic marriage is a contract (aqd) with specific mutual rights and obligations. Wife\'s rights from husband: mahr (mandatory gift), financial maintenance (nafaqah) covering food, housing, and clothing proportionate to the husband\'s means, emotional companionship and kindness. Husband\'s rights from wife: fidelity, maintaining the household, cooperation in family life. Scholars emphasize that the Quran (2:228) describes a "degree" of leadership for men in the family unit, balanced with the requirement of consultation (shura) and kind treatment (ma\'ruf).',
    contemporary_context:
      'Contemporary Islamic marriage counselors emphasize: the mahr should be agreed upon clearly before nikah; financial responsibilities should be discussed openly; household responsibilities should be agreed upon (scholars do not require the wife to do housework, though she may choose to); respectful communication and shura are Islamic requirements, not cultural options; pre-marital Islamic counseling is strongly recommended for all couples.',
    source_indices: [1, 4],
  },
  {
    category: 'relationships',
    title: 'How should a Muslim handle divorce if it becomes necessary?',
    content:
      'My marriage is in serious difficulty. How does Islam view divorce and what is the process?',
    scholarly_perspective:
      'Islam permits divorce (talaq) but describes it as "the most hated permissible thing" (Abu Dawud). The Quran (2:229-230) outlines a process designed to allow reconciliation: a waiting period (iddah), mediation attempts, and revocation options before divorce becomes final. Scholars consistently advise exhausting reconciliation options (including counseling) before proceeding to divorce. The wife\'s right to khul (divorce at her initiative by returning the mahr) is established in both Quran and Sunnah.',
    contemporary_context:
      'If you are considering divorce: seek Islamic marriage counseling first; involve trustworthy family arbiters as the Quran (4:35) instructs; if divorce becomes necessary, pursue it through proper Islamic and civil processes; the iddah period is 3 menstrual cycles for women, which scholars note provides a natural cooling period; children\'s welfare is the paramount Islamic concern in divorce; maintain Islamic dignified conduct throughout the process.',
    source_indices: [1, 2],
  },
  {
    category: 'relationships',
    title: 'What does Islam say about maintaining ties with ex-partners?',
    content:
      'I had a serious relationship before Islam. The person still contacts me. How should I handle this?',
    scholarly_perspective:
      'Islamic guidelines on gender interaction apply to ex-partners: they are non-mahram and the same rules of modesty, avoidance of seclusion (khalwa), and appropriate communication apply. If maintaining contact with an ex serves a legitimate purpose without arousing feelings that could lead to haram, scholars permit civil interaction (e.g., co-parenting). If the contact creates risks to one\'s Islamic practice or involves emotional attachment outside of marriage, it should be limited.',
    contemporary_context:
      'Practically, many converts find it helpful to: be honest with yourself about whether contact with an ex is genuinely neutral or creates temptation; set clear, kind boundaries; if you share children, maintain civil co-parenting communication while establishing appropriate limits; if necessary, communicate through a trusted third party initially until a healthy boundary is established. Your Islamic practice and future family life deserve protection.',
    source_indices: [2, 4],
  },
  {
    category: 'relationships',
    title: 'Is it permissible to have close friendships with the opposite gender?',
    content:
      'I have close friendships with people of the opposite gender. Do these need to change after becoming Muslim?',
    scholarly_perspective:
      'Islamic guidelines on male-female interaction emphasize: avoiding seclusion (khalwa) with a non-mahram; lowering the gaze; maintaining modesty. Scholars do not prohibit all interaction between genders — the Companions interacted with the opposite gender in appropriate contexts. However, the deep emotional intimacy of a "best friend" relationship with a non-mahram is subject to caution, particularly when it involves private sharing, physical contact, or situations that could lead to attachment.',
    contemporary_context:
      'Many converts gradually renegotiate existing opposite-gender friendships. Practically: you do not need to abruptly end friendships; gradually apply Islamic guidelines (less seclusion, more appropriate interaction settings, clear communication about your practice); genuine friends will respect your values; over time, your social circle naturally adjusts. The Islamic model is not isolation between genders but appropriate interaction with proper boundaries.',
    source_indices: [1, 4],
  },
  {
    category: 'relationships',
    title: 'How do I meet potential Muslim spouses as a convert?',
    content:
      'I am looking to get married but my social circle is mostly non-Muslim. How do I find a Muslim spouse?',
    scholarly_perspective:
      'Marriage is strongly encouraged in Islam — the Prophet (PBUH) described it as completing half of one\'s faith. Seeking a righteous spouse is itself a meritorious act. Islamic tradition supports family-facilitated introductions, community-based meetings, and formal matrimonial processes. What is required is that the process maintains Islamic modesty, involves proper oversight (wali for women), and has marriage as the explicit intent.',
    contemporary_context:
      'Practical paths for converts: join your local mosque community and participate actively — this is still the most natural path to meeting potential spouses; ask your imam or Muslim mentors to facilitate introductions; use reputable Islamic matrimonial websites (Muslim Marriage Guide, Half Our Deen, Minder/Muzmatch apps with appropriate caution); attend Islamic conferences and events; convert networks specifically often have matrimonial support.',
    source_indices: [1, 3],
  },
  {
    category: 'relationships',
    title: 'What does Islam say about LGBTQ relationships?',
    content:
      'I had a same-sex relationship before converting to Islam. How does Islam view this?',
    scholarly_perspective:
      'The classical and contemporary scholarly consensus across all four schools of Islamic law considers same-sex sexual relations to be prohibited (haram). This position is based on Quranic verses (7:80-81) and Hadith. Islam distinguishes between the feeling (same-sex attraction, which scholars do not condemn in itself and recognize as a struggle) and the act (same-sex sexual relations, which are prohibited). Pre-conversion sins are erased by the Shahada.',
    contemporary_context:
      'This is one of the most sensitive topics in contemporary Islamic discourse. Key pastoral guidance from Muslim scholars: your pre-conversion life is forgiven by Islam; experiencing same-sex attraction is not a sin in itself; the Islamic path involves remaining celibate if marriage to someone of the opposite gender is not pursued; Muslim support networks like the Straight Path Convention provide community for LGBTQ-identifying Muslims seeking to live within Islamic boundaries; professional Muslim counseling is available and recommended for those wrestling with this.',
    source_indices: [5, 3],
  },
  {
    category: 'relationships',
    title: 'How do I handle social pressure to date or have a relationship?',
    content:
      'My non-Muslim friends and colleagues constantly ask why I am not dating. How do I respond?',
    scholarly_perspective:
      'Social pressure does not override Islamic obligations. The Prophet (PBUH) instructed Muslims to be patient with those who question their practice and to respond with wisdom and good character. Scholars emphasize that calmly, confidently explaining one\'s religious practice is the appropriate response — not anger, defensiveness, or compromise of Islamic values.',
    contemporary_context:
      'Effective responses to dating pressure: "I\'m working toward marriage through a different process" (redirects toward your Islamic model); "Dating just isn\'t the path that works for me" (simple, non-judgmental); "I take relationships seriously and prefer to pursue them with commitment in mind" (universally respected value); you do not owe anyone detailed religious explanations; confidence and calmness are more persuasive than defensiveness; close friends deserve more context than acquaintances.',
    source_indices: [2, 1],
  },
  {
    category: 'relationships',
    title: 'What are the Islamic guidelines on physical contact before marriage?',
    content:
      'What physical interactions are permissible between non-married non-mahram men and women?',
    scholarly_perspective:
      'Scholars generally prohibit physical contact between non-mahram men and women, except in cases of necessity (medical treatment, etc.). The Hadith reports that the Prophet (PBUH) never shook hands with a non-mahram woman. However, scholars differ on whether incidental contact (handshakes in professional Western contexts) is strictly haram — some permit it under necessity while maintaining Islamic intent.',
    contemporary_context:
      'Practical guidance: in personal/social settings, avoiding physical contact with non-mahram is both feasible and clearly recommended; in professional settings (handshakes), many converts choose to explain their religious practice politely ("My faith tradition doesn\'t permit physical contact with opposite gender, but I mean no disrespect"); some scholars permit professional handshakes under professional necessity — consult a local scholar for your context. The spirit is to maintain modesty and clear boundaries, not to cause social offense.',
    source_indices: [1, 4],
  },
  {
    category: 'relationships',
    title: 'How do I approach conflict resolution in Islamic marriage?',
    content:
      'My spouse and I have frequent arguments. What does Islam say about resolving marital conflict?',
    scholarly_perspective:
      'The Quran (4:35) provides a formal conflict resolution process: each side appoints an arbitrator from their respective families, who then work to reconcile. The Prophetic model emphasizes: patience during anger (the Prophet said: "Do not get angry"), apologizing and forgiving readily, returning to one another with kindness (ma\'ruf), and not using the tongue as a weapon. The Prophet (PBUH) explicitly condemned physical harm and verbal abuse in marriage.',
    contemporary_context:
      'Islamic marriage counselors recommend: establish ground rules for disagreements (no raised voices, no name-calling); take a time-out when emotions are high; use "I" statements rather than accusatory language; seek Islamic marriage counseling proactively before crises develop; involve a trusted imam or Islamic counselor when conflicts are unresolvable between you. The Prophetic model of marriage is one of consultation, kindness, and mutual respect — apply these actively.',
    source_indices: [1, 3],
  },
  {
    category: 'relationships',
    title: 'What is the Islamic view on polygamy?',
    content:
      'I have questions about polygamy in Islam. Is it still practiced and what are the conditions?',
    scholarly_perspective:
      'The Quran (4:3) permits a Muslim man to marry up to four wives under the strict condition of absolute just treatment among all wives. If justice cannot be maintained — which the same verse implies is nearly impossible — the Quran advises marrying only one. The Prophet (PBUH) himself had multiple wives, but this was in unique circumstances. Most classical scholars treat polygamy as permitted but discouraged without compelling reason. Modern Muslim-majority countries have varying legal treatments of polygamy.',
    contemporary_context:
      'The contemporary reality is that polygamy is practiced by a small minority of Muslims and is illegal in many countries where Muslims live as minorities. Scholars in Western contexts generally advise against polygamy due to legal issues and the near-impossibility of achieving the Quranic standard of complete justice. If polygamy is being proposed in a marriage context, women should clearly understand their rights in Islamic law to include a monogamy clause in the marriage contract.',
    source_indices: [1, 5],
  },
  {
    category: 'relationships',
    title: 'How do I approach intimacy in Islamic marriage?',
    content:
      'What does Islam say about the sexual relationship between husband and wife?',
    scholarly_perspective:
      'Islam regards the marital sexual relationship as an act of worship (ibadah) — the Prophet (PBUH) described it as sadaqa (charity). Scholars teach that spouses have mutual rights to intimacy and that both partners must approach this aspect of marriage with care for the other. The Quran (2:223) addresses the marital relationship. Certain acts are prohibited within marriage (anal intercourse; sexual relations during menstruation or postpartum bleeding), while the broader marital relationship is celebrated and encouraged.',
    contemporary_context:
      'Islamic guidance on marital intimacy is far more developed and positive than commonly known. Muslim marriage preparation classes cover this topic as part of comprehensive nikah preparation. Open communication between spouses about their needs and boundaries is encouraged in Islamic teaching. Muslim therapists specializing in marriage can address specific challenges in this area within an Islamic framework. Pre-marital Islamic counseling is strongly recommended.',
    source_indices: [1, 4],
  },
  {
    category: 'relationships',
    title: 'Can I travel alone as a Muslim woman?',
    content:
      'What does Islam say about women traveling alone, particularly long distances or internationally?',
    scholarly_perspective:
      'Classical scholars (Hanafi, Maliki, Shafi\'i, Hanbali) require a mahram companion for women traveling a set distance (approximately 48 miles or the equivalent of a day\'s journey). This ruling was based on the safety realities of classical travel. Contemporary scholars have debated whether modern secure travel (air travel, organized tours) changes this ruling. A significant body of contemporary scholars permits women to travel alone when safety is reasonably assured, while the traditional position is maintained by others.',
    contemporary_context:
      'In practice: many Muslim women travel internationally alone for work, study, and Hajj (where organized group travel is an accepted substitute for the mahram requirement); the Saudi government now permits women over 21 to perform Hajj in groups without a mahram; different scholars will give different guidance on this — consult a scholar whose position you respect and whose reasoning you find persuasive given your specific travel context.',
    source_indices: [4, 2],
  },
  {
    category: 'relationships',
    title: 'How does Islam view domestic violence and abuse?',
    content:
      'Is there any Islamic basis for a husband to physically harm his wife? What does Islam say about abuse?',
    scholarly_perspective:
      'Islam categorically prohibits harm to one\'s spouse. The Prophet (PBUH) said: "The best of you are those who are best to their wives." He never struck a woman or child. The Quran (4:34) uses the word "darb" in the context of marital discord — this verse has been extensively debated; the majority of contemporary scholars, including those of the Fiqh Council of North America, state it cannot justify physical harm and refer to the broader Islamic ethic of kindness (ma\'ruf) that overrides any narrow reading.',
    contemporary_context:
      'Any physical, emotional, or psychological abuse in a marriage is un-Islamic and should not be tolerated. If you are in an abusive relationship: your safety is the priority; contact local domestic violence resources immediately; Muslim domestic violence organizations (Peaceful Families Project in the US, Safeera in UK) provide culturally sensitive support; an imam who understands the full Islamic ethic (not just one verse) will support you in seeking safety. Islam protects you.',
    source_indices: [1, 3],
  },
  {
    category: 'relationships',
    title: 'How do I handle social isolation after becoming Muslim?',
    content:
      'Since converting to Islam, I sometimes feel isolated from my previous social circles. How do I build community?',
    scholarly_perspective:
      'Community (ummah) is central to Islamic practice. The Prophet (PBUH) said: "The believer to another believer is like a building whose parts support each other." Scholars consistently emphasize the importance of community for spiritual strength, particularly for converts who may face isolation from previous social networks. The mosque is designed to be the center of Muslim community life.',
    contemporary_context:
      'Building a Muslim community as a convert: become a regular at your local mosque — consistency matters more than perfection; join convert-specific groups (many mosques and Islamic organizations have convert circles); attend Islamic events, conferences, and study circles; be patient — genuine community takes time to build; maintain some relationships with non-Muslim friends and family while building your Muslim community; online Muslim communities can bridge the gap during the transition period.',
    source_indices: [2, 3],
  },
];

async function getSeedUserId(): Promise<string> {
  // Try to get an existing user, or use the constant
  const { data } = await supabase
    .from('users')
    .select('id')
    .limit(1)
    .single();

  return data?.id ?? SEED_USER_ID;
}

async function getSeedSourceIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from('source_references')
    .select('id')
    .limit(10);

  if (error || !data || data.length === 0) {
    console.warn('No source references found — Q&A answers will have no source links.');
    return [];
  }

  return data.map((s: { id: string }) => s.id);
}

async function seedQA() {
  console.log('Starting Q&A knowledge base seeding...');

  const userId = await getSeedUserId();
  const sourceIds = await getSeedSourceIds();

  console.log(`Using user_id: ${userId}`);
  console.log(`Found ${sourceIds.length} source references`);

  let questionCount = 0;
  let answerCount = 0;

  for (const pair of qaPairs) {
    // Insert question
    const { data: question, error: qError } = await supabase
      .from('qa_questions')
      .insert({
        user_id: userId,
        title: pair.title,
        content: pair.content,
        category: pair.category,
        status: 'answered',
        sensitive_content: false,
        view_count: Math.floor(Math.random() * 300) + 50,
        helpful_count: Math.floor(Math.random() * 100) + 10,
      })
      .select('id')
      .single();

    if (qError) {
      console.error(`Error inserting question "${pair.title}":`, qError.message);
      continue;
    }

    questionCount++;

    // Pick 2-3 source IDs
    const selectedSourceIds = sourceIds.length > 0
      ? pair.source_indices
          .map((i) => sourceIds[i % sourceIds.length])
          .filter(Boolean)
          .slice(0, 3)
      : [];

    // Insert answer
    const { data: answer, error: aError } = await supabase
      .from('qa_answers')
      .insert({
        question_id: question.id,
        content: pair.scholarly_perspective + ' ' + pair.contemporary_context,
        scholarly_perspective: pair.scholarly_perspective,
        contemporary_context: pair.contemporary_context,
        source_ids: selectedSourceIds,
        created_by: userId,
        moderation_status: 'published',
        version: 1,
      })
      .select('id')
      .single();

    if (aError) {
      console.error(`Error inserting answer for "${pair.title}":`, aError.message);
      continue;
    }

    answerCount++;

    // Update question with answer_id and answered_at
    await supabase
      .from('qa_questions')
      .update({
        answer_id: answer.id,
        answered_at: new Date().toISOString(),
        status: 'answered',
      })
      .eq('id', question.id);
  }

  console.log(`\n✅ Seeding complete:`);
  console.log(`   Questions inserted: ${questionCount}`);
  console.log(`   Answers inserted: ${answerCount}`);

  // Final count
  const { count } = await supabase
    .from('qa_questions')
    .select('id', { count: 'exact', head: true });

  console.log(`   Total Q&A questions in DB: ${count}`);

  process.exit(0);
}

seedQA().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
