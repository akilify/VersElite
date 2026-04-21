import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdoeyxphajemxtkrapzx.supabase.co'; // Replace
const supabaseAnonKey = 'sb_publishable_XHXoxTjYjm-G6UXnoMX6bg_Om0kWbRF'; // Replace

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  // Step 1: Sign in as the test user
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'mukuwa47@gmail.com',
    password: 'my26lizzy2020',
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    return;
  }

  const user = authData.user;
  console.log('✅ Logged in as:', user.email);

  // Step 2: Insert a poem as the logged-in user
  const { data: poemData, error: poemError } = await supabase
    .from('poems')
    .insert({
      author_id: user.id,
      title: 'JavaScript Test Poem',
      content: 'This poem was created programmatically.',
      type: 'text',
    })
    .select();

  if (poemError) {
    console.error('Insert failed:', poemError.message);
  } else {
    console.log('✅ Poem inserted:', poemData);
  }

  // Step 3: Fetch all poems with author usernames
  const { data: poems, error: fetchError } = await supabase
    .from('poems')
    .select(`
      title,
      content,
      created_at,
      profiles ( username )
    `);

  if (fetchError) {
    console.error('Fetch failed:', fetchError.message);
  } else {
    console.log('✅ Poems with authors:', poems);
  }
}

test();