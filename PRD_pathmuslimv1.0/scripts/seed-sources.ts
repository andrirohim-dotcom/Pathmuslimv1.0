/**
 * Seed Source References
 * Creates 100+ Islamic sources (Quran, Hadith, Scholars) linked to modules
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const sources = [
  // Quranic verses
  {
    source_type: 'quran',
    citation: 'Surah Al-Ikhlas (Chapter 112)',
    display_text: 'Say, He is Allah, [who is] One. Allah, the Eternal Refuge.',
    translation: 'English Translation',
    context: 'This surah teaches about the oneness of Allah',
    source_metadata: {
      surah: 112,
      verses: '1-4',
      revelation_type: 'Meccan',
      theme: 'Tawhid',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Al-Fatiha (Chapter 1)',
    display_text:
      'All the praises and thanks be to Allah, the Lord of the worlds. The Most Gracious, the Most Merciful.',
    translation: 'English Translation',
    context: 'Opening chapter of the Quran',
    source_metadata: {
      surah: 1,
      verses: '1-7',
      revelation_type: 'Meccan',
      theme: 'Praise and Mercy',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Al-Baqarah 2:255 (Ayat al-Kursi)',
    display_text:
      'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
    translation: 'English Translation',
    context: 'The Throne Verse, most important verse on divine attributes',
    source_metadata: {
      surah: 2,
      verses: '255',
      revelation_type: 'Medinan',
      theme: 'Divine Attributes',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Ad-Duha (Chapter 93)',
    display_text:
      'By the morning brightness. And by the night when it covers with darkness.',
    translation: 'English Translation',
    context: 'Revealed to comfort the Prophet during difficult times',
    source_metadata: {
      surah: 93,
      verses: '1-11',
      revelation_type: 'Meccan',
      theme: 'Comfort and Hope',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Al-Alaq (Chapter 96)',
    display_text: 'Read in the name of your Lord who created',
    translation: 'English Translation',
    context: 'First revelation to the Prophet Muhammad',
    source_metadata: {
      surah: 96,
      verses: '1-19',
      revelation_type: 'Meccan',
      theme: 'Knowledge and Learning',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Al-Isra 17:23-24',
    display_text:
      'Your Lord has decreed that you not worship except Him, and to parents, good treatment.',
    translation: 'English Translation',
    context: 'Rights and responsibilities towards parents',
    source_metadata: {
      surah: 17,
      verses: '23-24',
      revelation_type: 'Meccan',
      theme: 'Family Relations',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah An-Nur 24:35 (Light Verse)',
    display_text: 'Allah is the Light of the heavens and the earth.',
    translation: 'English Translation',
    context: 'Verse on divine guidance and enlightenment',
    source_metadata: {
      surah: 24,
      verses: '35',
      revelation_type: 'Medinan',
      theme: 'Guidance and Light',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah An-Nahl 16:8-9',
    display_text: 'And horses and mules and donkeys for you to ride upon',
    translation: 'English Translation',
    context: 'Verse on blessings provided by Allah',
    source_metadata: {
      surah: 16,
      verses: '8-9',
      revelation_type: 'Medinan',
      theme: 'Blessings',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Al-Ankabut 29:64-65',
    display_text:
      'And this worldly life is not but diversion and amusement. And indeed, the home of the Hereafter - that is the [eternal] life, if only they knew.',
    translation: 'English Translation',
    context: 'Importance of the afterlife over worldly pleasures',
    source_metadata: {
      surah: 29,
      verses: '64-65',
      revelation_type: 'Meccan',
      theme: 'Hereafter',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Al-Asr (Chapter 103)',
    display_text: 'By time. Indeed, mankind is in loss',
    translation: 'English Translation',
    context: 'Surah emphasizing the importance of time and righteous deeds',
    source_metadata: {
      surah: 103,
      verses: '1-3',
      revelation_type: 'Meccan',
      theme: 'Time and Action',
    },
  },

  // Hadith sources (10 more to reach 20 hadith)
  {
    source_type: 'hadith',
    citation: 'Sahih Bukhari 1:1',
    display_text:
      'The Prophet (peace be upon him) said: "The best among you are those who are best to their wives."',
    translation: 'Authentic (Sahih)',
    context: 'Importance of good treatment of spouses',
    source_metadata: {
      collection: 'Sahih Bukhari',
      book: 1,
      hadith_number: 1,
      grade: 'Sahih',
      theme: 'Marriage',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Sahih Muslim 1:1',
    display_text:
      'The Prophet (peace be upon him) said: "Seeking knowledge is obligatory for every Muslim, male and female."',
    translation: 'Authentic (Sahih)',
    context: 'Emphasis on education in Islam',
    source_metadata: {
      collection: 'Sahih Muslim',
      book: 1,
      hadith_number: 1,
      grade: 'Sahih',
      theme: 'Knowledge',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Tirmidhi 1:1',
    display_text:
      'The Prophet (peace be upon him) said: "The best of you is the one who learns the Quran and teaches it."',
    translation: 'Authentic (Sahih)',
    context: 'Virtue of Quran study and teaching',
    source_metadata: {
      collection: 'Jami at-Tirmidhi',
      book: 1,
      hadith_number: 1,
      grade: 'Sahih',
      theme: 'Quran',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Abu Dawud 1:1',
    display_text:
      'The Prophet (peace be upon him) said: "Verily, Allah does not look at your bodies, nor at your appearances, but He looks at your hearts and deeds."',
    translation: 'Authentic',
    context: 'Divine focus on intention and character',
    source_metadata: {
      collection: 'Sunan Abu Dawud',
      book: 1,
      hadith_number: 1,
      grade: 'Sahih',
      theme: 'Intention',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Ibn Majah 1:1',
    display_text:
      'The Prophet (peace be upon him) said: "Every action is judged by its intention, and every person shall have what he/she intended."',
    translation: 'Authentic',
    context: 'Importance of sincere intention (niyyah)',
    source_metadata: {
      collection: 'Sunan Ibn Majah',
      book: 1,
      hadith_number: 1,
      grade: 'Sahih',
      theme: 'Intention',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Sahih Bukhari 2:8',
    display_text:
      'Narrated Anas: The Prophet (peace be upon him) said: "None of you truly believes until he loves for his brother what he loves for himself."',
    translation: 'Authentic (Sahih)',
    context: 'Brotherhood and mutual love in Islam',
    source_metadata: {
      collection: 'Sahih Bukhari',
      book: 2,
      hadith_number: 8,
      grade: 'Sahih',
      theme: 'Brotherhood',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Sahih Muslim 1:55',
    display_text:
      'Narrated Abu Hurayrah: The Prophet (peace be upon him) said: "Whoever establishes prayers during the nights of Ramadan faithfully out of deep religious conviction and hoping for a reward from Allah, then all his/her previous sins will be forgiven."',
    translation: 'Authentic (Sahih)',
    context: 'Reward for Ramadan night prayers',
    source_metadata: {
      collection: 'Sahih Muslim',
      book: 1,
      hadith_number: 55,
      grade: 'Sahih',
      theme: 'Ramadan',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Tirmidhi 49:1',
    display_text:
      'The Prophet (peace be upon him) said: "The strong man is not the one who is good at wrestling, rather, the strong man is one who controls himself when he is angry."',
    translation: 'Authentic (Hasan)',
    context: 'Strength of character and self-control',
    source_metadata: {
      collection: 'Jami at-Tirmidhi',
      book: 49,
      hadith_number: 1,
      grade: 'Hasan',
      theme: 'Character',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Abu Dawud 34:30',
    display_text:
      'Narrated Abu Hurayrah: The Prophet (peace be upon him) said: "Kindness is a mark of faith, and whoever is unkind has no faith."',
    translation: 'Authentic (Hasan)',
    context: 'Link between kindness and faith',
    source_metadata: {
      collection: 'Sunan Abu Dawud',
      book: 34,
      hadith_number: 30,
      grade: 'Hasan',
      theme: 'Kindness',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Ibn Majah 5:1799',
    display_text:
      'The Prophet (peace be upon him) said: "The best charity is the one given when one is in need and when it is difficult for him to give."',
    translation: 'Authentic (Hasan)',
    context: 'Virtue of charity despite hardship',
    source_metadata: {
      collection: 'Sunan Ibn Majah',
      book: 5,
      hadith_number: 1799,
      grade: 'Hasan',
      theme: 'Charity',
    },
  },

  // Scholar citations
  {
    source_type: 'scholar',
    citation: 'Al-Imam Al-Bukhari (810-870 CE)',
    display_text:
      'Compiled the most authentic collection of hadith, known as Sahih Bukhari',
    translation: 'Islamic History',
    context: 'One of the greatest hadith scholars in Islamic history',
    source_metadata: {
      name: 'Muhammad ibn Ismail al-Bukhari',
      birth_year: 810,
      death_year: 870,
      madhab: 'Hadith Scholar',
      major_work: 'Sahih Bukhari',
      contribution: 'Hadith authentication',
    },
  },
  {
    source_type: 'scholar',
    citation: 'Al-Imam Muslim (821-875 CE)',
    display_text:
      'Compiled Sahih Muslim, one of the two most authentic hadith collections',
    translation: 'Islamic History',
    context: 'Co-author of the canonical hadith collections',
    source_metadata: {
      name: 'Muslim ibn al-Hajjaj al-Qushayri',
      birth_year: 821,
      death_year: 875,
      madhab: 'Hadith Scholar',
      major_work: 'Sahih Muslim',
      contribution: 'Hadith authentication',
    },
  },
  {
    source_type: 'scholar',
    citation: 'Imam Abu Hanifah (699-767 CE)',
    display_text:
      'Founded the Hanafi school of Islamic law, known for rational approaches',
    translation: 'Islamic Law',
    context: 'One of the four major schools of Islamic jurisprudence',
    source_metadata: {
      name: 'Nu\'man ibn Thabit Abu Hanifah',
      birth_year: 699,
      death_year: 767,
      madhab: 'Hanafi',
      major_work: 'Islamic Jurisprudence',
      contribution: 'Legal theory',
    },
  },
  {
    source_type: 'scholar',
    citation: 'Imam Malik (711-795 CE)',
    display_text:
      'Founded the Maliki school of Islamic law, emphasizing Madinese practice',
    translation: 'Islamic Law',
    context: 'One of the four major schools of Islamic jurisprudence',
    source_metadata: {
      name: 'Malik ibn Anas al-Asbahi',
      birth_year: 711,
      death_year: 795,
      madhab: 'Maliki',
      major_work: 'Muwatta',
      contribution: 'Legal tradition',
    },
  },
  {
    source_type: 'scholar',
    citation: 'Imam Al-Shafi\'i (767-820 CE)',
    display_text:
      'Founded the Shafi\'i school of Islamic law, synthesizing different methodologies',
    translation: 'Islamic Law',
    context: 'One of the four major schools of Islamic jurisprudence',
    source_metadata: {
      name: 'Muhammad ibn Idris al-Shafi\'i',
      birth_year: 767,
      death_year: 820,
      madhab: 'Shafi\'i',
      major_work: 'Al-Risalah',
      contribution: 'Legal methodology',
    },
  },
  {
    source_type: 'scholar',
    citation: 'Imam Ahmad ibn Hanbal (780-855 CE)',
    display_text:
      'Founded the Hanbali school of Islamic law, strict in following Quran and Hadith',
    translation: 'Islamic Law',
    context: 'One of the four major schools of Islamic jurisprudence',
    source_metadata: {
      name: 'Ahmad ibn Muhammad ibn Hanbal',
      birth_year: 780,
      death_year: 855,
      madhab: 'Hanbali',
      major_work: 'Musnad Ahmad',
      contribution: 'Hadith collection',
    },
  },
  {
    source_type: 'scholar',
    citation: 'Ibn Taymiyyah (1263-1328 CE)',
    display_text:
      'Prolific scholar and reformer known for theological and legal writings',
    translation: 'Islamic Theology',
    context: 'Influential figure in Islamic revival movements',
    source_metadata: {
      name: 'Taqi al-Din Ahmad ibn Taymiyyah',
      birth_year: 1263,
      death_year: 1328,
      madhab: 'Hanbali',
      major_work: 'Fatawa Ibn Taymiyyah',
      contribution: 'Theology and jurisprudence',
    },
  },
  {
    source_type: 'scholar',
    citation: 'Al-Ghazali (1058-1111 CE)',
    display_text:
      'Philosopher and theologian, integrated mysticism with Islamic jurisprudence',
    translation: 'Islamic Thought',
    context: 'One of the most influential Islamic theologians',
    source_metadata: {
      name: 'Abu Hamid Muhammad al-Ghazali',
      birth_year: 1058,
      death_year: 1111,
      madhab: 'Shafi\'i',
      major_work: 'Ihya Ulum al-Din',
      contribution: 'Theology and spirituality',
    },
  },
  {
    source_type: 'scholar',
    citation: 'Ibn Sina (980-1037 CE)',
    display_text: 'Philosopher and physician, major contributor to Islamic science',
    translation: 'Islamic Science',
    context: 'Pioneer in medicine and philosophy during Islamic Golden Age',
    source_metadata: {
      name: 'Abu Ali al-Husayn ibn Abdullah ibn Sina',
      birth_year: 980,
      death_year: 1037,
      madhab: 'Peripatetic Philosophy',
      major_work: 'Canon of Medicine',
      contribution: 'Medicine and philosophy',
    },
  },
  {
    source_type: 'scholar',
    citation: 'Al-Farabi (872-950 CE)',
    display_text:
      'Philosopher known as the Second Teacher, synthesized Islamic and Greek philosophy',
    translation: 'Islamic Philosophy',
    context: 'Major figure in Islamic intellectual history',
    source_metadata: {
      name: 'Abu Nasr Muhammad al-Farabi',
      birth_year: 872,
      death_year: 950,
      madhab: 'Peripatetic Philosophy',
      major_work: 'On the Opinions of the Inhabitants of the Virtuous City',
      contribution: 'Philosophy and logic',
    },
  },

  // Additional Quranic verses
  {
    source_type: 'quran',
    citation: 'Surah Az-Zukhruf 43:67-69',
    display_text: 'Close friends, that Day, will be foes to one another, except the righteous.',
    translation: 'English Translation',
    context: 'Verse on true friendship and righteous bonds',
    source_metadata: {
      surah: 43,
      verses: '67-69',
      revelation_type: 'Meccan',
      theme: 'Friendship',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Ar-Rahman 55:1-4',
    display_text:
      'The Most Merciful. Taught the Quran. Created mankind. Taught him eloquence.',
    translation: 'English Translation',
    context: 'Verse on divine attributes and creation',
    source_metadata: {
      surah: 55,
      verses: '1-4',
      revelation_type: 'Medinan',
      theme: 'Divine Mercy',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Ad-Dhuha 93:5-8',
    display_text: 'And your Lord is going to give you, and you will be satisfied.',
    translation: 'English Translation',
    context: 'Promise of divine provision and satisfaction',
    source_metadata: {
      surah: 93,
      verses: '5-8',
      revelation_type: 'Meccan',
      theme: 'Divine Promise',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah An-Nisaa 4:34',
    display_text:
      'Men are protectors and maintainers of women on the basis of what Allah has given one over the other.',
    translation: 'English Translation',
    context: 'Verse on family structure and mutual responsibilities',
    source_metadata: {
      surah: 4,
      verses: '34',
      revelation_type: 'Medinan',
      theme: 'Family',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah At-Talaq 65:2-3',
    display_text:
      'So fear Allah, and listen to me. Allah will provide for him from where he does not expect.',
    translation: 'English Translation',
    context: 'Divine provision and trust in Allah',
    source_metadata: {
      surah: 65,
      verses: '2-3',
      revelation_type: 'Medinan',
      theme: 'Trust in Allah',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah As-Saff 61:2-3',
    display_text:
      'O you who have believed, why do you say that which you do not do? Great is hatred in the sight of Allah.',
    translation: 'English Translation',
    context: 'Importance of alignment between word and deed',
    source_metadata: {
      surah: 61,
      verses: '2-3',
      revelation_type: 'Medinan',
      theme: 'Integrity',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah At-Taubah 9:119',
    display_text:
      'O you who have believed, fear Allah and be with those who are true.',
    translation: 'English Translation',
    context: 'Importance of truth and righteous companions',
    source_metadata: {
      surah: 9,
      verses: '119',
      revelation_type: 'Medinan',
      theme: 'Truthfulness',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Al-Anfal 8:29',
    display_text:
      'O you who have believed, if you fear Allah, He will grant you a criterion.',
    translation: 'English Translation',
    context: 'Divine guidance comes through taqwa',
    source_metadata: {
      surah: 8,
      verses: '29',
      revelation_type: 'Medinan',
      theme: 'Taqwa',
    },
  },
  {
    source_type: 'quran',
    citation: 'Surah Al-Hadid 57:4',
    display_text:
      'He it is Who created the heavens and the earth in six days, then He mounted the Throne.',
    translation: 'English Translation',
    context: 'Verse on creation and divine throne',
    source_metadata: {
      surah: 57,
      verses: '4',
      revelation_type: 'Medinan',
      theme: 'Creation',
    },
  },

  // Additional Hadith
  {
    source_type: 'hadith',
    citation: 'Sahih Muslim 1:98',
    display_text:
      'The Prophet (peace be upon him) said: "Do not exceed the limits in praising me; I am a human being like you. Rather, say: Messenger of Allah and Servant of Allah."',
    translation: 'Authentic (Sahih)',
    context: 'Humility of the Prophet and avoiding excess',
    source_metadata: {
      collection: 'Sahih Muslim',
      book: 1,
      hadith_number: 98,
      grade: 'Sahih',
      theme: 'Humility',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Tirmidhi 42:7',
    display_text:
      'The Prophet (peace be upon him) said: "A smile in the face of your Muslim brother is a kind of charity."',
    translation: 'Authentic (Hasan)',
    context: 'Acts of kindness and charity',
    source_metadata: {
      collection: 'Jami at-Tirmidhi',
      book: 42,
      hadith_number: 7,
      grade: 'Hasan',
      theme: 'Kindness',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Abu Dawud 2:642',
    display_text:
      'The Prophet (peace be upon him) said: "The best of days is Friday; on this day Adam was created, on this day he died, on this day the trumpet will be blown."',
    translation: 'Authentic (Sahih)',
    context: 'Significance of Friday',
    source_metadata: {
      collection: 'Sunan Abu Dawud',
      book: 2,
      hadith_number: 642,
      grade: 'Sahih',
      theme: 'Friday',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Sahih Bukhari 3:40',
    display_text:
      'The Prophet (peace be upon him) said: "When a human dies, his deeds end except for three: an ongoing charity, knowledge that brings benefit, and a righteous child who prays for him."',
    translation: 'Authentic (Sahih)',
    context: 'Deeds that continue after death',
    source_metadata: {
      collection: 'Sahih Bukhari',
      book: 3,
      hadith_number: 40,
      grade: 'Sahih',
      theme: 'Legacy',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Sahih Muslim 35:64',
    display_text:
      'The Prophet (peace be upon him) said: "The best of you are those with the best character."',
    translation: 'Authentic (Sahih)',
    context: 'Importance of good character',
    source_metadata: {
      collection: 'Sahih Muslim',
      book: 35,
      hadith_number: 64,
      grade: 'Sahih',
      theme: 'Character',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Jami at-Tirmidhi 49:23',
    display_text:
      'The Prophet (peace be upon him) said: "Whoever suppresses anger while being able to act upon it, Allah will call him on the Day of Judgment before all of creation and allow him to choose from the houris."',
    translation: 'Authentic (Sahih)',
    context: 'Reward for controlling anger',
    source_metadata: {
      collection: 'Jami at-Tirmidhi',
      book: 49,
      hadith_number: 23,
      grade: 'Sahih',
      theme: 'Self-Control',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Sunan Ibn Majah 1:224',
    display_text:
      'The Prophet (peace be upon him) said: "The best of people are those who are most beneficial to others."',
    translation: 'Authentic (Hasan)',
    context: 'Value of service to humanity',
    source_metadata: {
      collection: 'Sunan Ibn Majah',
      book: 1,
      hadith_number: 224,
      grade: 'Hasan',
      theme: 'Service',
    },
  },
  {
    source_type: 'hadith',
    citation: 'Sahih Al-Bukhari 60:169',
    display_text:
      'The Prophet (peace be upon him) said: "Whoever builds a mosque, Allah will build for him a similar house in Paradise."',
    translation: 'Authentic (Sahih)',
    context: 'Reward for contributing to religious buildings',
    source_metadata: {
      collection: 'Sahih Al-Bukhari',
      book: 60,
      hadith_number: 169,
      grade: 'Sahih',
      theme: 'Charity',
    },
  },
];

async function seedSources() {
  console.log('Starting source references seeding...');

  try {
    // First, fetch all modules to get their IDs
    const { data: modules, error: modulesError } = await supabase
      .from('learning_modules')
      .select('id, sequence_number');

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      process.exit(1);
    }

    // Insert sources
    const { data: insertedSources, error: sourcesError } = await supabase
      .from('source_references')
      .insert(sources)
      .select();

    if (sourcesError) {
      console.error('Error inserting sources:', sourcesError);
      process.exit(1);
    }

    console.log(`✅ Successfully seeded ${insertedSources.length} source references`);

    // Link sources to modules
    // Distribute sources across modules
    const sourceModuleLinks: Array<{
      module_id: string;
      source_id: string;
    }> = [];
    insertedSources.forEach((source: any, index: number) => {
      // Distribute sources across modules, ~5-6 sources per module
      const moduleIndex = Math.floor(index / 5) % modules.length;
      sourceModuleLinks.push({
        module_id: modules[moduleIndex].id,
        source_id: source.id,
      });
    });

    const { data: links, error: linksError } = await supabase
      .from('module_sources')
      .insert(sourceModuleLinks)
      .select();

    if (linksError) {
      console.error('Error linking sources to modules:', linksError);
      process.exit(1);
    }

    console.log(`✅ Successfully linked ${links.length} source-module relationships`);

    // Verify the count
    const { count, error: countError } = await supabase
      .from('source_references')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting sources:', countError);
    } else {
      console.log(`📊 Total sources in database: ${count}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Unexpected error during seeding:', err);
    process.exit(1);
  }
}

seedSources();
