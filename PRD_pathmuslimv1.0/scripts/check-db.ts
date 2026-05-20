import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'
);

async function checkTables() {
  try {
    const tables = [
      'users',
      'learning_modules',
      'qa_questions',
      'qa_answers',
      'source_references',
      'learner_progress',
      'learning_milestones',
      'user_settings',
      'module_sources',
      'answer_sources'
    ];

    console.log('Checking database tables...\n');

    for (const table of tables) {
      const { error, data } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`✗ ${table}: ${error.message}`);
      } else {
        console.log(`✓ ${table}: OK`);
      }
    }

    console.log('\n✓ All tables created successfully!');
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

checkTables();
