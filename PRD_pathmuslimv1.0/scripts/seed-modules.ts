/**
 * Seed Learning Modules
 * Creates 20 learning modules with comprehensive Islamic curriculum
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const modules = [
  {
    title: 'Islamic Fundamentals',
    description: 'Introduction to the core beliefs and practices of Islam',
    sequence_number: 1,
    level: 'beginner',
    estimated_hours: 3,
    content: `# Islamic Fundamentals

This module covers the essential beliefs that form the foundation of Islam.

## Topics Covered
- Tawhid (Monotheism)
- The Five Pillars
- Articles of Faith
- Islamic law and ethics

## Learning Outcomes
After completing this module, you will understand:
1. The concept of Tawhid and its importance
2. The foundation of Islamic practice
3. Core Islamic beliefs
4. The relationship between belief and action`,
    learning_objectives: [
      'Understand Tawhid (the oneness of Allah)',
      'Learn the Five Pillars of Islam',
      'Understand the Articles of Faith',
      'Grasp the fundamentals of Islamic law',
    ],
    prerequisites: [],
  },
  {
    title: 'Understanding the Quran',
    description: 'Explore the holy book of Islam and its structure',
    sequence_number: 2,
    level: 'beginner',
    estimated_hours: 2,
    content: `# Understanding the Quran

The Quran is the divine revelation to the Prophet Muhammad (peace be upon him).

## What is the Quran?
- The final revelation from Allah
- Organized in 114 chapters (Surahs)
- Over 6,000 verses (Ayahs)
- Preserved word-for-word for 1400+ years

## Historical Context
- Revealed over 23 years
- Addressed specific historical situations
- Progressive revelation
- Timeless wisdom

## Reading the Quran
- Traditional order vs. chronological order
- Understanding translations
- The importance of Tafsir (interpretation)`,
    learning_objectives: [
      'Understand the structure of the Quran',
      'Learn the history of Quranic revelation',
      'Know the importance of understanding context',
      'Appreciate different approaches to studying the Quran',
    ],
    prerequisites: [1],
  },
  {
    title: 'Understanding Hadith',
    description: 'Study the Sunnah and the teachings of Prophet Muhammad',
    sequence_number: 3,
    level: 'beginner',
    estimated_hours: 2,
    content: `# Understanding Hadith

Hadith are the recorded sayings, actions, and approvals of Prophet Muhammad (peace be upon him).

## What is Hadith?
- Second source of Islamic law after Quran
- Sunnah (the way of the Prophet)
- Compiled by scholars generations after the Prophet
- Authentication process (grading: Sahih, Hasan, Weak)

## Major Collections
- Sahih Bukhari
- Sahih Muslim
- Other authentic collections

## Relevance Today
- Practical implementation of Islamic principles
- Guidance for contemporary issues
- Balance between textual and contextual understanding`,
    learning_objectives: [
      'Understand what Hadith are and their role in Islam',
      'Learn about the authentication process',
      'Recognize major Hadith collections',
      'Understand how Hadith inform Islamic practice',
    ],
    prerequisites: [1, 2],
  },
  {
    title: 'The Five Pillars of Islam',
    description: 'Deep dive into the five foundational practices of Islam',
    sequence_number: 4,
    level: 'beginner',
    estimated_hours: 3,
    content: `# The Five Pillars of Islam

The Five Pillars are the fundamental acts of worship in Islam.

## The Five Pillars

### 1. Shahada (Declaration of Faith)
- Belief in one God
- Muhammad is His messenger

### 2. Salah (Prayer)
- Five daily prayers
- Direction toward Mecca
- Specific movements and recitations

### 3. Zakat (Almsgiving)
- Purification through giving
- Social responsibility
- Calculation and distribution

### 4. Sawm (Fasting)
- Fasting during Ramadan
- Spiritual growth
- Empathy for the less fortunate

### 5. Hajj (Pilgrimage)
- Journey to Mecca
- Standing before Allah
- Unity of Muslims worldwide`,
    learning_objectives: [
      'Understand each of the Five Pillars',
      'Learn the spiritual significance of each pillar',
      'Grasp the practical implementation',
      'Appreciate the unity they create in the Muslim community',
    ],
    prerequisites: [1],
  },
  {
    title: 'Islamic Ethics and Morality',
    description: 'Explore the ethical framework that guides Muslim conduct',
    sequence_number: 5,
    level: 'beginner',
    estimated_hours: 2,
    content: `# Islamic Ethics and Morality

Islam provides a comprehensive framework for ethical living.

## Core Ethical Principles
- Honesty and truthfulness (Sidq)
- Justice (Adl)
- Mercy and compassion (Rahmah)
- Responsibility and accountability
- Respect for life and dignity

## Islamic Virtues
- Patience (Sabr)
- Generosity (Karam)
- Courage and strength (Shuja'ah)
- Wisdom (Hikmah)
- Gratitude (Shukr)

## Application in Daily Life
- Family relationships
- Business dealings
- Community interactions
- Environmental responsibility
- Treatment of animals`,
    learning_objectives: [
      'Understand the foundational ethical principles in Islam',
      'Learn about Islamic virtues and their importance',
      'Apply ethics to real-life situations',
      'Develop a principled approach to decision-making',
    ],
    prerequisites: [1],
  },
  {
    title: 'The Prophet Muhammad and His Legacy',
    description: 'Life and teachings of the Prophet Muhammad (peace be upon him)',
    sequence_number: 6,
    level: 'intermediate',
    estimated_hours: 3,
    content: `# The Prophet Muhammad and His Legacy

Muhammad (peace be upon him) is the final messenger of Allah.

## Early Life
- Born in Mecca in 570 CE
- Orphaned at a young age
- Known for honesty and integrity
- Marriage to Khadijah

## The Prophethood
- First revelation at age 40
- Message of monotheism
- Opposition and persecution
- Migration to Medina (Hijra)

## Leadership and Teachings
- Building the Muslim community (Ummah)
- Justice and governance
- Relations with other communities
- Spiritual and moral leadership

## The Legacy
- The Quran and Sunnah
- The Ummah spanning 1400+ years
- Principles for all times and places`,
    learning_objectives: [
      'Learn the biographical details of the Prophet',
      'Understand his role as a messenger',
      'Grasp his teachings and principles',
      'Appreciate his impact on history and civilization',
    ],
    prerequisites: [1, 2],
  },
  {
    title: 'Belief in Allah and His Attributes',
    description: 'Understanding God in Islamic theology',
    sequence_number: 7,
    level: 'intermediate',
    estimated_hours: 2,
    content: `# Belief in Allah and His Attributes

Tawhid (belief in one God) is the cornerstone of Islamic faith.

## The Concept of Allah
- The only God worthy of worship
- Creator of all existence
- Beyond human comprehension yet intimately close
- Merciful and Just

## The 99 Names of Allah
- Al-Rahman (The Merciful)
- Al-Adl (The Just)
- Al-Alim (The All-Knowing)
- Al-Qawi (The Strong)
- And 95 others...

## Divine Attributes
- Power and knowledge
- Mercy and justice
- Wisdom and will
- Eternality and transcendence

## Practical Implications
- Submission to Allah's will
- Trust in Allah's plan
- Seeking nearness to Allah
- Worship from understanding not just habit`,
    learning_objectives: [
      'Understand the Islamic concept of God (Allah)',
      'Learn about the divine attributes',
      'Explore the 99 Names of Allah',
      'Apply theological understanding to spiritual growth',
    ],
    prerequisites: [1],
  },
  {
    title: 'Islamic History: From the Prophet to the Empires',
    description: 'Survey of major periods in Islamic history',
    sequence_number: 8,
    level: 'intermediate',
    estimated_hours: 3,
    content: `# Islamic History: From the Prophet to the Empires

Islamic history spans over 1400 years with rich and diverse traditions.

## The Early Period
- The Rightly Guided Caliphs (7th century)
- Rapid expansion and consolidation
- Development of Islamic law and governance

## The Classical Period
- The Umayyad Caliphate
- The Abbasid Caliphate
- The Golden Age of Islam

## Medieval and Early Modern Period
- The Ottoman Empire
- Islamic Spain (Al-Andalus)
- Islamic civilization in Asia

## Modern Period
- Colonial era and resistance
- Formation of modern nation-states
- Contemporary Islamic movements

## Key Lessons
- Diversity within Islamic civilization
- Adaptation to different contexts
- Balance between tradition and innovation`,
    learning_objectives: [
      'Understand major periods of Islamic history',
      'Learn about key historical figures and events',
      'Appreciate the diversity of Islamic civilization',
      'Connect history to contemporary Islam',
    ],
    prerequisites: [6],
  },
  {
    title: 'Islamic Law and Legal Principles',
    description: 'Introduction to Sharia and Islamic jurisprudence',
    sequence_number: 9,
    level: 'intermediate',
    estimated_hours: 3,
    content: `# Islamic Law and Legal Principles

Sharia (Islamic law) is derived from the Quran, Hadith, Ijma, and Qiyas.

## Sources of Islamic Law
- The Quran (primary)
- The Sunnah (recorded teachings and practices)
- Ijma (scholarly consensus)
- Qiyas (analogical reasoning)

## Schools of Jurisprudence
- Hanafi
- Maliki
- Shafi'i
- Hanbali
- And others

## Legal Principles
- Maqasid al-Sharia (objectives of the law)
- Maslaha (public interest)
- Istislah (seeking benefit)
- Adaptation and context

## Areas of Law
- Personal law (family, inheritance)
- Commercial law
- Criminal law
- Constitutional law

## Contemporary Application
- Modern legal systems
- Adaptation to changing circumstances
- Balancing tradition with progress`,
    learning_objectives: [
      'Understand the sources and development of Islamic law',
      'Learn about the schools of jurisprudence',
      'Grasp key legal principles',
      'Explore contemporary legal issues in Islam',
    ],
    prerequisites: [1, 2, 3],
  },
  {
    title: 'Women in Islam',
    description: 'Rights, roles, and contributions of women in Islamic tradition',
    sequence_number: 10,
    level: 'intermediate',
    estimated_hours: 2,
    content: `# Women in Islam

Islam recognizes the dignity, rights, and important roles of women.

## Historical Perspectives
- Pre-Islamic Arabia
- Women in the Quran and Hadith
- Distinguished women in Islamic history
- Mothers of the Believers

## Rights and Responsibilities
- Educational rights
- Economic rights
- Legal rights
- Family rights
- Political participation

## Common Misconceptions
- Hijab and modest dress
- Marriage and consent
- Divorce and custody
- Work and public life

## Contemporary Issues
- Education and career
- Family dynamics
- Leadership roles
- Balancing tradition and modernity

## Inspiring Examples
- Aisha (wife of the Prophet)
- Fatima (daughter of the Prophet)
- Female scholars and leaders`,
    learning_objectives: [
      'Understand Islamic teachings on gender equality',
      'Learn about women\'s rights in Islam',
      'Explore the contributions of women in Islamic history',
      'Address misconceptions about women in Islam',
    ],
    prerequisites: [1, 4, 5],
  },
  {
    title: 'Islamic Family and Social Life',
    description: 'Family structure, marriage, and social relationships in Islam',
    sequence_number: 11,
    level: 'intermediate',
    estimated_hours: 2,
    content: `# Islamic Family and Social Life

The family is the foundation of Islamic society.

## The Family Unit
- Marriage as a contract and partnership
- Rights and responsibilities of spouses
- Parenting and child-rearing
- Extended family relationships

## Marriage in Islam
- Ijab and Qabul (offer and acceptance)
- The Mahr (gift from groom to bride)
- Consent and witnesses
- The wedding ceremony

## Parenting and Children
- Education and moral upbringing
- Balance between discipline and kindness
- Teaching Islamic values
- Respecting parents' rights

## Social Relations
- Neighborly conduct
- Friendship and brotherhood/sisterhood
- Community responsibility
- Helping those in need

## Contemporary Challenges
- Interfaith relationships
- Modern dating norms
- Technology and family life
- Work-life balance`,
    learning_objectives: [
      'Understand Islamic teachings on marriage and family',
      'Learn about parenting in Islamic tradition',
      'Grasp social etiquette and relationships',
      'Apply Islamic principles to family situations',
    ],
    prerequisites: [5, 10],
  },
  {
    title: 'Islamic Spirituality and Mysticism',
    description: 'Inner dimensions of Islamic faith and practice',
    sequence_number: 12,
    level: 'advanced',
    estimated_hours: 3,
    content: `# Islamic Spirituality and Mysticism

Beyond the external practices lies the inner dimension of Islam.

## Ihsan (Excellence)
- Worshipping Allah as if you see Him
- Presence of heart in worship
- Continuous consciousness of Allah

## The Soul (Nafs)
- Stages of spiritual development
- Purification of the self
- Overcoming ego and desires

## Sufi Traditions
- Spiritual orders (Tariqas)
- The path to nearness to Allah
- Remembrance (Dhikr)
- Meditation and contemplation

## Spiritual Practices
- Supererogatory prayers
- Recitation of the Quran
- Seeking knowledge
- Serving others
- Solitude and retreat

## The Spiritual Dimension
- Connection with the Divine
- Inner peace and tranquility
- Transformation of character
- Meaning and purpose

## Contemporary Spirituality
- Balancing outer and inner practices
- Modern spiritual movements
- Authenticity in spirituality`,
    learning_objectives: [
      'Understand the spiritual dimensions of Islam',
      'Learn about Ihsan and its significance',
      'Explore Sufi traditions and practices',
      'Develop a deeper spiritual practice',
    ],
    prerequisites: [1, 4, 6],
  },
  {
    title: 'Islamic Economics and Finance',
    description: 'Economic principles and practices in Islam',
    sequence_number: 13,
    level: 'advanced',
    estimated_hours: 3,
    content: `# Islamic Economics and Finance

Islam provides principles for ethical economic activity.

## Fundamental Principles
- Justice in transactions
- Prohibition of Riba (interest)
- Prohibition of Gharar (uncertainty)
- Social responsibility
- Protection of the poor

## Islamic Finance
- Mudharaba (profit-sharing)
- Musharaka (partnership)
- Murabaha (cost-plus financing)
- Islamic banking and finance

## Business Ethics
- Honesty and transparency
- Fair dealing
- Labor rights
- Consumer protection
- Environmental responsibility

## Wealth and Property
- Ownership and stewardship
- Zakat and obligatory giving
- Inheritance laws
- Collective ownership concepts

## Debt and Loans
- Ethical borrowing
- Obligation to repay
- Forgiveness of debts
- Relief for debtors

## Contemporary Issues
- Interest-free banking
- Islamic investments
- Economic justice
- Wealth inequality`,
    learning_objectives: [
      'Understand Islamic economic principles',
      'Learn about Islamic finance mechanisms',
      'Grasp business ethics in Islam',
      'Explore wealth management and charity',
    ],
    prerequisites: [5, 9],
  },
  {
    title: 'Islamic Medicine and Health',
    description: 'Health practices and medical ethics in Islam',
    sequence_number: 14,
    level: 'advanced',
    estimated_hours: 2,
    content: `# Islamic Medicine and Health

Islam emphasizes both physical and spiritual well-being.

## Health as a Blessing
- The body as a trust from Allah
- Maintaining health and fitness
- Prevention of disease
- Medical treatment

## Islamic Medical Ethics
- Seeking treatment is encouraged
- Doctors and healing
- Consent and confidentiality
- Honesty in diagnosis
- Research and ethics

## Halal and Haram Foods
- Permitted and forbidden foods
- Nutritional wisdom
- Slaughtering practices
- Contemporary food industry

## Personal Hygiene
- Ritual purification (Wudu and Ghusl)
- Cleanliness in daily life
- Prevention of disease
- Natural remedies

## Mental and Spiritual Health
- Mental health in Islamic tradition
- Dealing with depression and anxiety
- Seeking help and counseling
- Spiritual healing practices

## Women\'s Health
- Menstruation and religious practice
- Pregnancy and childbirth
- Medical treatment during sacred months
- Breastfeeding and nutrition`,
    learning_objectives: [
      'Understand Islamic teachings on health',
      'Learn about medical ethics in Islam',
      'Grasp Islamic nutrition principles',
      'Explore mental and spiritual well-being',
    ],
    prerequisites: [1, 5],
  },
  {
    title: 'Islam and Science',
    description: 'Relationship between Islamic faith and scientific inquiry',
    sequence_number: 15,
    level: 'advanced',
    estimated_hours: 2,
    content: `# Islam and Science

Islam encourages the pursuit of knowledge and scientific understanding.

## Islamic Golden Age
- Centers of learning and translation
- Contributions to mathematics, astronomy, medicine
- Philosophers and scientists
- Libraries and preservation of knowledge

## Quranic Perspectives on Science
- Verses about the natural world
- Scientific accuracy in the Quran
- Encouragement of observation and reasoning
- Balance between revelation and reason

## The Scientific Method
- Observation and experimentation
- Logical reasoning
- Peer review and verification
- Integration with faith

## Contemporary Science
- Evolutionary theory and Islamic belief
- Cosmology and the universe
- Medicine and biotechnology
- Environmental science

## Areas of Study
- Astronomy and cosmology
- Biology and human development
- Physics and natural laws
- Geology and Earth sciences

## Faith and Reason
- Compatible perspectives
- Addressing apparent contradictions
- Humility in knowledge
- The limits of human understanding`,
    learning_objectives: [
      'Understand the Islamic intellectual tradition',
      'Learn about the scientific contributions of Muslims',
      'Explore the Quran from a scientific perspective',
      'Reconcile faith with scientific knowledge',
    ],
    prerequisites: [2, 12],
  },
  {
    title: 'Islamic Art, Culture, and Civilization',
    description: 'Artistic, literary, and cultural achievements in Islam',
    sequence_number: 16,
    level: 'advanced',
    estimated_hours: 3,
    content: `# Islamic Art, Culture, and Civilization

Islamic civilization has produced remarkable artistic and cultural achievements.

## Islamic Art Forms
- Calligraphy and manuscript illumination
- Geometric patterns and tessellations
- Architecture and design
- Carpet weaving and textiles
- Ceramics and decorative arts

## Literature and Poetry
- Classical Arabic poetry
- Sufi poetry and mysticism
- Stories and narratives (like the Quran and Hadith)
- Scholarly and philosophical works

## Architecture
- Mosques and sacred spaces
- Palaces and civic buildings
- Gardens and water features
- Urban planning and design

## Music and Performance
- Traditional music and instruments
- Quranic recitation (Tajweed)
- Spiritual music and gatherings
- Contemporary musical expressions

## Sciences and Philosophy
- Mathematics and algebra
- Astronomy and navigation
- Medicine and hospitals
- Philosophy and theology

## Cultural Diversity
- Regional variations and styles
- Influences from different civilizations
- Adaptation and innovation
- Contemporary Islamic culture`,
    learning_objectives: [
      'Appreciate the breadth of Islamic art and culture',
      'Learn about major artistic achievements',
      'Understand the principles behind Islamic aesthetics',
      'Explore the diversity of Islamic civilization',
    ],
    prerequisites: [8],
  },
  {
    title: 'Islam and the Modern World',
    description: 'Contemporary challenges and Islamic responses',
    sequence_number: 17,
    level: 'advanced',
    estimated_hours: 3,
    content: `# Islam and the Modern World

Muslims navigate the challenges and opportunities of the modern age.

## Colonialism and Independence
- Colonial impact on Muslim societies
- Struggles for independence
- Nation-building and sovereignty
- Postcolonial challenges

## Modernization and Tradition
- Balancing innovation and preservation
- Educational systems
- Technological adoption
- Social transformation

## Political Systems
- Democratic governance
- Islamic law in modern states
- Citizenship and pluralism
- Human rights frameworks

## Migration and Diaspora
- Muslim communities in non-Muslim countries
- Cultural adaptation and identity
- Building institutions and communities
- Contributing to society

## Global Challenges
- Climate change and environment
- Poverty and development
- War and peace
- Disease and health crises

## Islamic Responses
- Ijtihad (independent reasoning)
- Consulting tradition while embracing modernity
- Maintaining core principles with context-aware application
- Building bridges with other faiths and ideologies`,
    learning_objectives: [
      'Understand contemporary Muslim societies',
      'Learn about modern Islamic thought and movements',
      'Grasp the challenges of living Islam today',
      'Explore Islamic responses to global issues',
    ],
    prerequisites: [8, 9],
  },
  {
    title: 'Interfaith Relations and Islamic Perspectives',
    description: 'Islam\'s relationships with other religions and worldviews',
    sequence_number: 18,
    level: 'advanced',
    estimated_hours: 2,
    content: `# Interfaith Relations and Islamic Perspectives

Islam acknowledges other faiths and promotes coexistence.

## Islamic View of Other Faiths
- People of the Book (Christians and Jews)
- Other religions and their followers
- Diversity as divine will
- Common values and principles

## Historical Coexistence
- Muslim-Christian relations in history
- Islamic Spain (Al-Andalus)
- Ottoman dhimmi system
- Periods of cooperation and conflict

## Contemporary Dialogue
- Interfaith organizations and movements
- Muslim-Christian dialogue
- Building understanding and respect
- Addressing misconceptions

## Religious Freedom
- Right to practice religion
- Protection of minorities
- Mutual respect
- Living together in plural societies

## Common Ground
- Shared theological concepts
- Ethical principles
- Social justice concerns
- Peace and reconciliation

## Challenges
- Extremism and extremist narratives
- Political conflicts and religious identity
- Media representation
- Education and awareness

## Personal Engagement
- Respectful dialogue
- Learning from others
- Addressing prejudice
- Contributing to peace`,
    learning_objectives: [
      'Understand Islamic perspectives on other faiths',
      'Learn about historical interfaith relations',
      'Explore contemporary dialogue and cooperation',
      'Develop interfaith understanding',
    ],
    prerequisites: [1, 12],
  },
  {
    title: 'New Muslims: Journey of Faith',
    description: 'Special considerations for those newly embracing Islam',
    sequence_number: 19,
    level: 'intermediate',
    estimated_hours: 2,
    content: `# New Muslims: Journey of Faith

Embracing Islam is a significant life journey with unique experiences.

## Initial Steps
- Understanding the Shahada
- First practices and rituals
- Learning the basics of prayer
- Building a support community

## Cultural and Religious Integration
- Islam beyond cultural practices
- Finding authentic teaching
- Navigating cultural differences
- Building Muslim identity

## Challenges and Solutions
- Family and social adjustment
- Identity and belonging
- Learning the Arabic terminology
- Practical implementation

## Sources of Support
- Mosque and community
- Mentors and teachers
- Online resources
- Support groups

## Family Relations
- Communicating with non-Muslim family
- Maintaining ties with loved ones
- Introducing family to Islam
- Setting boundaries

## Personal Growth
- Spiritual development
- Building knowledge progressively
- Patience with yourself
- Long-term commitment

## Rights and Recognition
- Full equality in Islam
- No distinction based on conversion
- Leadership and authority
- Belonging to the Ummah`,
    learning_objectives: [
      'Understand the journey of new Muslims',
      'Learn practical tips for starting out',
      'Grasp how to navigate cultural differences',
      'Build a strong foundation in faith',
    ],
    prerequisites: [1, 4],
  },
  {
    title: 'Quranic Wisdom and Life Lessons',
    description: 'Practical guidance from the Quran for daily living',
    sequence_number: 20,
    level: 'intermediate',
    estimated_hours: 2,
    content: `# Quranic Wisdom and Life Lessons

The Quran provides guidance for all aspects of life.

## Major Themes
- Trust in Allah (Tawakkul)
- Gratitude and praise
- Patience and perseverance
- Justice and fairness
- Mercy and compassion

## Stories and Parables
- Stories of the Prophets
- Examples of believers and disbelievers
- Moral lessons from history
- Guidance through narrative

## Practical Guidance
- Decision-making based on Quran
- Conflict resolution
- Building healthy relationships
- Managing finances wisely
- Facing adversity

## Spiritual Nourishment
- Reflection and contemplation
- Healing and comfort
- Encouragement and hope
- Connection with Allah

## Application to Modern Life
- Career and vocation
- Education and learning
- Community service
- Personal development

## Methods of Engagement
- Daily reading practice
- Memorization (Hafiz)
- Study groups and circles
- Seeking understanding
- Living the teachings`,
    learning_objectives: [
      'Understand major themes in the Quran',
      'Learn from Quranic stories and parables',
      'Apply Quranic guidance to daily life',
      'Develop a consistent practice of Quranic reflection',
    ],
    prerequisites: [2],
  },
];

async function seedModules() {
  console.log('Starting module seeding...');

  try {
    const { data, error } = await supabase.from('learning_modules').insert(modules).select();

    if (error) {
      console.error('Error inserting modules:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully seeded ${data.length} modules`);

    // Verify the count
    const { count, error: countError } = await supabase
      .from('learning_modules')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting modules:', countError);
    } else {
      console.log(`📊 Total modules in database: ${count}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Unexpected error during seeding:', err);
    process.exit(1);
  }
}

seedModules();
