const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'trainer-lessons.ts');
let content = fs.readFileSync(filePath, 'utf8');

const rawTranslations = {
    "അടിസ്ഥാനം": "Foundation",
    "വാക്കുകൾ": "Words",
    "പ്രാക്ടീസ്": "Practice",
    "പരീക്ഷണം": "Checkpoints",
    "പുനഃപരിശീലനം": "Revision",
    "പരീക്ഷ": "Tests",
    "ഒഴുക്ക്": "Fluency",
    "പരിശീലനം": "Training",

    "പുതിയ അക്ഷരങ്ങൾ": "New Letters",
    "മിശ്ര പരിശീലനം": "Mixed Practice",
    "അക്ഷര അവലോകനം": "Letter Review",
    "പുതിയ അക്ഷരം": "New Letter",
    "സ്വരചിഹ്നങ്ങൾ": "Vowel Signs",
    "പൂർണ്ണ അവലോകനം": "Complete Review",

    "സാധാരണ വാക്കുകൾ": "Common Words",
    "വാക്കുകളുടെ പരിശീലനം": "Word Practice",
    "മിശ്ര വാക്കുകൾ": "Mixed Words",
    "വാക്കുകളുടെ മാസ്റ്ററി": "Word Mastery",
    "വാക്കുകളുടെ കൂട്ടങ്ങൾ": "Word Groups",

    "ചെറിയ വാക്യങ്ങൾ": "Short Sentences",
    "വാക്യ പരിശീലനം": "Sentences",
    "ചോദ്യങ്ങൾ": "Questions",
    "ചോദ്യ പരിശീലനം": "Question Practice",
    "മിശ്ര വാക്യങ്ങൾ": "Mixed Sentences",
    "വാക്യ മാസ്റ്ററി": "Sentence Mastery",

    "ദീർഘ വാക്യങ്ങൾ": "Long Sentences",
    "വിവരണ വാക്യങ്ങൾ": "Descriptive Sentences",
    "വാക്യ പ്രവാഹം": "Sentence Flow",

    "അക്കങ്ങളും സമയവും": "Numbers & Time",
    "അക്കങ്ങളും തീയതികളും": "Numbers & Dates",
    "ചിഹ്നങ്ങൾ": "Symbols",

    "ചെറിയ പാരഗ്രാഫ്": "Short Paragraph",
    "പാരഗ്രാഫ് പരിശീലനം": "Paragraphs",
    "പാരഗ്രാഫ് മാസ്റ്ററി": "Paragraph Mastery",
    "വിവരണ പരിശീലനം": "Descriptive Writing",
    "അഡ്വാൻസ്ഡ് പാരഗ്രാഫ്": "Advanced Paragraphs",
    "ദീർഘ പാരഗ്രാഫ്": "Long Paragraphs",

    "സംഭാഷണ പരിശീലനം": "Dialogues",
    "സംഭാഷണം": "Dialogues",
    "ദീർഘ സംഭാഷണം": "Long Dialogues",

    "മിശ്ര എഴുത്ത്": "Mixed Writing",
    "അഭിപ്രായ എഴുത്ത്": "Opinion Writing",
    "വിവരണ എഴുത്ത്": "Descriptive Writing",
    "ഔപചാരിക എഴുത്ത്": "Formal Writing",
    "ഉപന്യാസ പരിശീലനം": "Essay Practice",

    "മലയാളം ടൈപ്പിംഗ് മാസ്റ്ററി": "Malayalam Typing Mastery",

    "മാസ്റ്ററി ടെസ്റ്റ്": "Mastery Tests",
    "മാസ്റ്ററി തയ്യാറെടുപ്പ്": "Mastery Preparation",
    "മാസ്റ്ററി പരിശീലനം": "Mastery Practice",
    "മിശ്ര മാസ്റ്ററി": "Mixed Mastery",
    "ഗ്രാൻഡ് മാസ്റ്ററി": "Grand Mastery",

    "വാർത്താ ശൈലി": "News Style",
    "സാങ്കേതികവിദ്യ": "Technology",
    "സമൂഹം": "Society",

    "കഥാ പരിശീലനം": "Story Practice",

    "എക്സ്പർട്ട് പരിശീലനം": "Expert Practice",
    "എക്സ്പർട്ട് ടെസ്റ്റ്": "Expert Test",
    "എക്സ്പർട്ട്": "Expert",
    "എക്സ്പർട്ട് ചലഞ്ച്": "Expert Challenge",

    "അഡ്വാൻസ്ഡ്": "Advanced",
    "അഡ്വാൻസ്ഡ് പരിശീലനം": "Advanced Practice",
    "അഡ്വാൻസ്ഡ് ടെസ്റ്റ്": "Advanced Test",
    "അഡ്വാൻസ്ഡ് റിയൽ വേൾഡ്": "Advanced Real World",

    "പ്രൊഫഷണൽ": "Professional",

    "എക്സ്പർട്ട് റിയൽ വേൾഡ്": "Expert Real World",

    "അവസാന പരീക്ഷ": "Final Test",
    "അവസാന പരീക്ഷണം": "Final Assessment",
    "അവസാന ചലഞ്ച്": "Final Challenge",

    "ഗ്രാൻഡ് എക്സ്പർട്ട്": "Grand Expert",
};

for (const [malyalam, english] of Object.entries(rawTranslations)) {
    // Replace double quoted occurrences
    content = content.split('"' + malyalam + '"').join('"' + english + '"');
    // Replace single quoted occurrences
    content = content.split("'" + malyalam + "'").join("'" + english + "'");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully completed full translations in trainer-lessons.ts!');
