"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
    IconKeyboard,
    IconReload,
    IconClock,
    IconVolume,
    IconVolumeOff,
    IconTrophy,
    IconHome,
} from "@tabler/icons-react";
import { malayalamKeyMap, keyboardRows } from "@/lib/keyboard/malayalam";

const MALAYALAM_SENTENCES = [
    "കേരളം മനോഹരമായ നാടാണ്",
    "മലയാളം നമ്മുടെ സ്വന്തം ഭാഷയാണ്",
    "കേരളത്തിന്റെ പ്രകൃതി എല്ലാവരെയും ആകർഷിക്കുന്നു",
    "കേരളത്തിൽ ധാരാളം പുഴകളും കായലുകളും ഉണ്ട്",
    "നമ്മുടെ നാടിന്റെ പച്ചപ്പ് മനോഹരമാണ്",
    "മഴക്കാലത്ത് കേരളം കൂടുതൽ മനോഹരമാകുന്നു",
    "കേരളത്തിലെ ഗ്രാമങ്ങൾക്ക് പ്രത്യേകമായൊരു ഭംഗിയുണ്ട്",
    "നാട്ടിലെ ചെറിയ വഴികൾ മനോഹരമായ കാഴ്ചകൾ നൽകുന്നു",
    "തെങ്ങിൻതോപ്പുകൾ കേരളത്തിന്റെ പ്രത്യേകതയാണ്",
    "കായലിന്റെ കരയിൽ കാറ്റ് ആസ്വദിക്കുന്നത് നല്ലതാണ്",
    "പുഴയുടെ തീരത്ത് ഇരിക്കുന്നത് മനസ്സിന് സന്തോഷം നൽകുന്നു",
    "കേരളത്തിലെ മലനിരകൾ വളരെ മനോഹരമാണ്",
    "നാട്ടിലെ വയലുകൾ കണ്ണിന് കുളിർമ നൽകുന്നു",
    "മഴയ്ക്ക് ശേഷം പ്രകൃതി കൂടുതൽ മനോഹരമായി തോന്നുന്നു",
    "കേരളത്തിലെ ഓരോ പ്രദേശത്തിനും വ്യത്യസ്തമായ ഭംഗിയുണ്ട്",

    "രാവിലെ നേരത്തെ എഴുന്നേൽക്കുന്നത് നല്ല ശീലമാണ്",
    "രാവിലെ തണുത്ത കാറ്റ് വീശുന്നുണ്ടായിരുന്നു",
    "പുലർച്ചെ പക്ഷികളുടെ ശബ്ദം കേൾക്കാൻ നല്ല രസമാണ്",
    "സൂര്യൻ പതുക്കെ കിഴക്കേ ആകാശത്ത് ഉദിച്ചു",
    "രാവിലെ സൂര്യപ്രകാശം മുറിയിലേക്ക് കടന്നു",
    "അമ്മ രാവിലെ ഭക്ഷണം തയ്യാറാക്കി",
    "അച്ഛൻ രാവിലെ പത്രം വായിച്ചു",
    "കുട്ടികൾ സ്കൂളിലേക്ക് പോകാൻ തയ്യാറായി",
    "രാവിലെ എല്ലാവരും ഒരുമിച്ച് പ്രഭാതഭക്ഷണം കഴിച്ചു",
    "രാവിലെ കുറച്ചുനേരം നടക്കുന്നത് ആരോഗ്യത്തിന് നല്ലതാണ്",
    "പ്രഭാതത്തിലെ ശാന്തമായ അന്തരീക്ഷം മനസ്സിന് ആശ്വാസം നൽകുന്നു",
    "രാവിലെ ജനൽ തുറന്നപ്പോൾ തണുത്ത കാറ്റ് അകത്തേക്ക് വന്നു",
    "പുതിയ ദിവസം സന്തോഷത്തോടെ ആരംഭിക്കണം",
    "ഓരോ പ്രഭാതവും പുതിയ പ്രതീക്ഷകൾ നൽകുന്നു",
    "രാവിലെ സമയം പഠനത്തിന് ഉപയോഗിക്കുന്നത് നല്ലതാണ്",

    "ഇന്ന് നല്ലൊരു ദിവസമാണ്",
    "ഇന്ന് രാവിലെ നല്ല മഴ പെയ്തു",
    "ഇന്ന് എനിക്ക് കുറച്ച് ജോലി ഉണ്ടായിരുന്നു",
    "ഇന്ന് വീട്ടിൽ എല്ലാവരും സന്തോഷത്തിലാണ്",
    "ഇന്ന് ഞാൻ ഒരു പുതിയ കാര്യം പഠിച്ചു",
    "ഇന്ന് സ്കൂളിൽ ഒരു പരിപാടി ഉണ്ടായിരുന്നു",
    "ഇന്ന് സുഹൃത്തുക്കളോടൊപ്പം സമയം ചെലവഴിച്ചു",
    "ഇന്ന് വൈകുന്നേരം നടക്കാൻ പോകണം",
    "ഇന്ന് പഠിക്കാൻ കൂടുതൽ സമയം ലഭിച്ചു",
    "ഇന്ന് കാലാവസ്ഥ വളരെ മനോഹരമാണ്",
    "നാളെ രാവിലെ നേരത്തെ എഴുന്നേൽക്കണം",
    "നാളെ പുതിയൊരു പാഠം പഠിക്കണം",
    "നാളെ സുഹൃത്തുക്കളെ കാണാൻ പോകും",
    "നാളെ വീട്ടിൽ ഒരു ചെറിയ പരിപാടിയുണ്ട്",
    "നാളെ യാത്ര ആരംഭിക്കാനാണ് തീരുമാനം",

    "അമ്മ അടുക്കളയിൽ ഭക്ഷണം തയ്യാറാക്കുന്നു",
    "അച്ഛൻ ഓഫീസിലേക്ക് പോകാൻ തയ്യാറായി",
    "സഹോദരൻ പുസ്തകം വായിച്ചുകൊണ്ടിരുന്നു",
    "സഹോദരി മുറിയിൽ പഠിക്കുകയായിരുന്നു",
    "കുട്ടികൾ മുറ്റത്ത് കളിക്കുകയായിരുന്നു",
    "മുത്തശ്ശി കുട്ടികൾക്ക് കഥ പറഞ്ഞു",
    "മുത്തച്ഛൻ പഴയകാലത്തെ കാര്യങ്ങൾ പറഞ്ഞു",
    "കുടുംബത്തോടൊപ്പം സമയം ചെലവഴിക്കുന്നത് സന്തോഷമാണ്",
    "കുടുംബത്തിലെ എല്ലാവരും പരസ്പരം സഹായിക്കുന്നു",
    "വീട്ടിൽ എല്ലാവരും ഒരുമിച്ച് ഭക്ഷണം കഴിച്ചു",
    "വീട്ടുമുറ്റത്ത് നിരവധി ചെടികൾ വളരുന്നുണ്ട്",
    "വീടിന് മുന്നിൽ ഒരു വലിയ മരം നിൽക്കുന്നു",
    "വീട്ടിലെ ചെറിയ സന്തോഷങ്ങളാണ് ജീവിതത്തെ മനോഹരമാക്കുന്നത്",
    "കുടുംബത്തിന്റെ സ്നേഹം വലിയൊരു ശക്തിയാണ്",
    "കുടുംബത്തോടൊപ്പമുള്ള നിമിഷങ്ങൾ എന്നും ഓർമ്മയിൽ നിൽക്കും",

    "കുട്ടികൾ സ്കൂളിലേക്ക് സന്തോഷത്തോടെ പോയി",
    "അധ്യാപകൻ പുതിയ പാഠം വിശദീകരിച്ചു",
    "വിദ്യാർത്ഥികൾ ശ്രദ്ധയോടെ ക്ലാസ് കേട്ടു",
    "വിദ്യാർത്ഥി അധ്യാപകനോട് ഒരു ചോദ്യം ചോദിച്ചു",
    "അധ്യാപകൻ ചോദ്യത്തിന് വ്യക്തമായ ഉത്തരം നൽകി",
    "സ്കൂൾ മുറ്റത്ത് കുട്ടികൾ കളിച്ചു",
    "പഠനം ജീവിതത്തിലെ പ്രധാനപ്പെട്ട കാര്യമാണ്",
    "വിദ്യാഭ്യാസം പുതിയ അവസരങ്ങൾ തുറക്കുന്നു",
    "പുസ്തകങ്ങൾ അറിവിന്റെ വലിയൊരു ഉറവിടമാണ്",
    "വായന നല്ലൊരു ശീലമാണ്",
    "ദിവസവും കുറച്ചുസമയം വായിക്കണം",
    "പഠിച്ച കാര്യങ്ങൾ ആവർത്തിക്കുന്നത് നല്ലതാണ്",
    "പഠനത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കണം",
    "പരീക്ഷയ്ക്ക് മുമ്പ് നല്ല രീതിയിൽ തയ്യാറെടുക്കണം",
    "സമയക്രമം പാലിച്ച് പഠിക്കുന്നത് വളരെ പ്രയോജനകരമാണ്",
    "അറിവ് നേടാൻ എപ്പോഴും ശ്രമിക്കണം",
    "പുതിയ കാര്യങ്ങൾ പഠിക്കാൻ ഒരിക്കലും മടിക്കരുത്",
    "സംശയങ്ങൾ ചോദിക്കുന്നത് പഠനത്തിന്റെ ഭാഗമാണ്",
    "വിദ്യാർത്ഥികൾ പരസ്പരം സഹായിച്ച് പഠിച്ചു",
    "നല്ല വിദ്യാഭ്യാസം ജീവിതത്തെ മാറ്റാൻ കഴിയും",

    "മലയാളം വായിക്കുന്നത് എനിക്ക് ഇഷ്ടമാണ്",
    "മലയാളത്തിൽ എഴുതുന്നത് നല്ലൊരു അനുഭവമാണ്",
    "മലയാളം വളരെ സമ്പന്നമായ ഭാഷയാണ്",
    "മലയാളത്തിൽ നിരവധി മനോഹരമായ വാക്കുകളുണ്ട്",
    "മലയാളത്തിലെ കവിതകൾ വളരെ മനോഹരമാണ്",
    "മലയാളത്തിലെ കഥകൾ വായിക്കാൻ രസമാണ്",
    "ഭാഷ പഠിക്കാൻ സ്ഥിരമായ പരിശീലനം ആവശ്യമാണ്",
    "പുതിയ വാക്കുകൾ ദിവസവും പഠിക്കാം",
    "വാക്കുകളുടെ അർത്ഥം മനസ്സിലാക്കി പഠിക്കണം",
    "ശരിയായ ഉച്ചാരണം ഭാഷയെ കൂടുതൽ മനോഹരമാക്കുന്നു",
    "വായനയിലൂടെ പുതിയ വാക്കുകൾ പഠിക്കാം",
    "എഴുത്തിലൂടെ ചിന്തകൾ വ്യക്തമായി പ്രകടിപ്പിക്കാം",
    "മലയാളം ടൈപ്പിംഗ് പഠിക്കാൻ പരിശീലനം ആവശ്യമാണ്",
    "ദിവസവും മലയാളം ടൈപ്പ് ചെയ്യുന്നത് സഹായകരമാണ്",
    "മലയാളത്തിൽ വേഗത്തിൽ ടൈപ്പ് ചെയ്യാൻ ക്ഷമ വേണം",

    "മലയാളം ടൈപ്പിംഗ് എളുപ്പത്തിൽ പഠിക്കാം",
    "ടൈപ്പിംഗ് പരിശീലനം ദിവസവും തുടരുക",
    "ആദ്യം കൃത്യതയിൽ ശ്രദ്ധിക്കുക",
    "പിന്നീട് ടൈപ്പിംഗ് വേഗത വർധിപ്പിക്കുക",
    "വേഗതയെക്കാൾ കൃത്യതയ്ക്ക് പ്രാധാന്യം നൽകണം",
    "ഓരോ അക്ഷരവും ശ്രദ്ധയോടെ ടൈപ്പ് ചെയ്യണം",
    "തെറ്റുകൾ സംഭവിച്ചാൽ വീണ്ടും ശ്രമിക്കണം",
    "തെറ്റുകളിൽ നിന്ന് പഠിക്കാൻ ശ്രമിക്കുക",
    "നിരന്തരമായ പരിശീലനം മികച്ച ഫലം നൽകും",
    "ദിവസവും പത്ത് മിനിറ്റ് ടൈപ്പ് ചെയ്യുക",
    "കൂടുതൽ പരിശീലനം കൂടുതൽ ആത്മവിശ്വാസം നൽകും",
    "ടൈപ്പിംഗ് ചെയ്യുമ്പോൾ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക",
    "കീബോർഡിലെ അക്ഷരങ്ങളുടെ സ്ഥാനം മനസ്സിലാക്കുക",
    "വിരലുകളുടെ ശരിയായ സ്ഥാനം പരിശീലിക്കുക",
    "ശരിയായ രീതിയിൽ പരിശീലിച്ചാൽ വേഗത വർധിക്കും",
    "ഓരോ ദിവസവും നിങ്ങളുടെ പ്രകടനം മെച്ചപ്പെടുത്തുക",
    "ടൈപ്പിംഗ് പഠിക്കാൻ ക്ഷമ വളരെ പ്രധാനമാണ്",
    "പതുക്കെ തുടങ്ങി ക്രമേണ വേഗത വർധിപ്പിക്കുക",
    "തുടർച്ചയായ പരിശീലനം നല്ല ശീലം ഉണ്ടാക്കും",
    "പരിശീലനം നിർത്താതെ മുന്നോട്ട് പോകുക",

    "മഴ പെയ്യുന്നത് കാണാൻ നല്ല രസമാണ്",
    "ഇന്ന് രാവിലെ മുതൽ മഴ പെയ്യുകയാണ്",
    "മഴത്തുള്ളികൾ ജനൽച്ചില്ലിൽ പതിച്ചു",
    "മഴയ്ക്ക് ശേഷം വഴികൾ നനഞ്ഞു",
    "മഴ കഴിഞ്ഞപ്പോൾ ആകാശം തെളിഞ്ഞു",
    "കറുത്ത മേഘങ്ങൾ ആകാശത്ത് നിറഞ്ഞു",
    "തണുത്ത കാറ്റ് പുറത്തേക്ക് വീശുന്നു",
    "മരങ്ങളുടെ ഇലകൾ കാറ്റിൽ ആടുന്നു",
    "മഴവില്ല് ആകാശത്ത് മനോഹരമായി തെളിഞ്ഞു",
    "മഴത്തുള്ളികൾ ഇലകളിൽ മുത്തുപോലെ തിളങ്ങി",
    "മഴക്കാലത്ത് പുഴകളിൽ വെള്ളം കൂടുന്നു",
    "മഴക്കാലത്ത് ചെടികൾ കൂടുതൽ പച്ചയായി വളരുന്നു",
    "മഴയുടെ ശബ്ദം കേൾക്കാൻ വളരെ സുഖമാണ്",
    "മഴയുള്ള ദിവസങ്ങളിൽ ചൂടുള്ള ചായ കുടിക്കാൻ നല്ലതാണ്",
    "മഴ കഴിഞ്ഞുള്ള പ്രകൃതിക്ക് പ്രത്യേകമായൊരു ഭംഗിയുണ്ട്",

    "സൂര്യൻ ആകാശത്ത് പ്രകാശിക്കുന്നു",
    "ചന്ദ്രൻ രാത്രിയിൽ മനോഹരമായി തിളങ്ങുന്നു",
    "നക്ഷത്രങ്ങൾ ആകാശത്ത് നിറഞ്ഞുനിന്നു",
    "സൂര്യാസ്തമയം കാണാൻ വളരെ മനോഹരമാണ്",
    "സൂര്യോദയത്തിന്റെ കാഴ്ച മനസ്സിനെ സന്തോഷിപ്പിക്കുന്നു",
    "ആകാശത്ത് വെളുത്ത മേഘങ്ങൾ ഒഴുകുന്നു",
    "കാറ്റിൽ മരങ്ങളുടെ ഇലകൾ ശബ്ദിക്കുന്നു",
    "പക്ഷികൾ ആകാശത്ത് കൂട്ടമായി പറന്നു",
    "കിളികൾ മരത്തിന്റെ കൊമ്പിൽ ഇരുന്നു",
    "ശലഭങ്ങൾ പൂക്കൾക്ക് ചുറ്റും പറന്നു",
    "തുമ്പികൾ വെള്ളത്തിനരികിലൂടെ പറന്നു",
    "പൂക്കൾ രാവിലെ മനോഹരമായി വിരിഞ്ഞു",
    "തോട്ടത്തിലെ പൂക്കൾക്ക് നല്ല സുഗന്ധമുണ്ട്",
    "മരങ്ങൾ പ്രകൃതിയുടെ പ്രധാന ഭാഗമാണ്",
    "പച്ചപ്പുള്ള സ്ഥലങ്ങൾ മനസ്സിന് സന്തോഷം നൽകുന്നു",

    "കടൽത്തീരത്ത് വൈകുന്നേരം നടക്കാൻ പോയി",
    "കടലിലെ തിരകൾ കരയിലേക്ക് വന്നു",
    "കടൽക്കാറ്റ് വളരെ തണുത്തതായിരുന്നു",
    "കടൽ കാണുന്നത് എനിക്ക് വളരെ ഇഷ്ടമാണ്",
    "സൂര്യാസ്തമയം കാണാൻ കടൽത്തീരം നല്ല സ്ഥലമാണ്",
    "പുഴയുടെ തീരത്ത് നിരവധി മരങ്ങളുണ്ട്",
    "പുഴയിലെ വെള്ളം പതുക്കെ ഒഴുകുന്നു",
    "കായലിലെ വെള്ളത്തിൽ ചെറിയ തിരകൾ ഉണ്ടായിരുന്നു",
    "കായലിന്റെ കരയിൽ നിരവധി പക്ഷികളെ കണ്ടു",
    "മലമുകളിൽ നിന്നുള്ള കാഴ്ച അതിമനോഹരമാണ്",
    "മലകളിൽ രാവിലെ മഞ്ഞ് നിറഞ്ഞിരുന്നു",
    "കാട്ടിലൂടെ നടക്കുമ്പോൾ നിരവധി പക്ഷികളെ കണ്ടു",
    "കാടിന്റെ ശാന്തത മനസ്സിന് ആശ്വാസം നൽകുന്നു",
    "വനങ്ങൾ നിരവധി ജീവികളുടെ വീടാണ്",
    "പ്രകൃതിയെ സംരക്ഷിക്കേണ്ടത് നമ്മുടെ ഉത്തരവാദിത്വമാണ്",

    "സുഹൃത്തുക്കളോടൊപ്പം സമയം ചെലവഴിക്കുന്നത് സന്തോഷമാണ്",
    "നല്ല സുഹൃത്ത് ബുദ്ധിമുട്ടുകളിൽ കൂടെ നിൽക്കും",
    "സുഹൃത്തുക്കൾ തമ്മിൽ പരസ്പരം സഹായിക്കണം",
    "സുഹൃത്തുക്കളോടൊപ്പം യാത്ര ചെയ്യുന്നത് വളരെ രസകരമാണ്",
    "പഴയ സുഹൃത്തിനെ വർഷങ്ങൾക്ക് ശേഷം കണ്ടു",
    "സുഹൃത്തുക്കളുമായി സംസാരിക്കുമ്പോൾ സമയം പെട്ടെന്ന് കടന്നുപോകുന്നു",
    "നല്ല സൗഹൃദം വിശ്വാസത്തിൽ വളരുന്നു",
    "പരസ്പരം ബഹുമാനിക്കുന്നതാണ് നല്ല സൗഹൃദത്തിന്റെ അടിസ്ഥാനം",
    "സുഹൃത്തിന്റെ വിജയത്തിൽ സന്തോഷിക്കണം",
    "പ്രശ്നങ്ങൾ വരുമ്പോൾ സുഹൃത്തുക്കളെ പിന്തുണയ്ക്കണം",

    "ഇന്ന് ഞങ്ങൾ ഒരു പുതിയ സ്ഥലത്തേക്ക് യാത്ര ചെയ്തു",
    "യാത്രയിൽ നിരവധി മനോഹരമായ കാഴ്ചകൾ കണ്ടു",
    "പുതിയ സ്ഥലങ്ങൾ സന്ദർശിക്കുന്നത് നല്ല അനുഭവമാണ്",
    "തീവണ്ടിയാത്ര എനിക്ക് വളരെ ഇഷ്ടമാണ്",
    "തീവണ്ടി കൃത്യസമയത്ത് സ്റ്റേഷനിലെത്തി",
    "യാത്രക്കാർ ട്രെയിനിനായി കാത്തുനിന്നു",
    "ബസിൽ ഇന്ന് നല്ല തിരക്കായിരുന്നു",
    "റോഡിൽ വാഹനങ്ങളുടെ തിരക്ക് കൂടുതലായിരുന്നു",
    "ട്രാഫിക് കാരണം യാത്ര കുറച്ച് വൈകി",
    "യാത്രയ്ക്ക് മുമ്പ് ആവശ്യമായ സാധനങ്ങൾ തയ്യാറാക്കി",
    "പുതിയ സ്ഥലത്തെ ആളുകൾ വളരെ സൗഹൃദപരമായിരുന്നു",
    "യാത്രകൾ പുതിയ അനുഭവങ്ങൾ നൽകുന്നു",
    "ഓരോ യാത്രയും പുതിയൊരു ഓർമ്മ സമ്മാനിക്കുന്നു",
    "യാത്ര ചെയ്യുമ്പോൾ പ്രകൃതിയുടെ ഭംഗി ആസ്വദിക്കണം",
    "സുരക്ഷിതമായി യാത്ര ചെയ്യുന്നത് വളരെ പ്രധാനമാണ്",

    "സാങ്കേതികവിദ്യ നമ്മുടെ ജീവിതം എളുപ്പമാക്കി",
    "കമ്പ്യൂട്ടർ ഇന്ന് പല ജോലികൾക്കും ആവശ്യമാണ്",
    "ഇന്റർനെറ്റ് അറിവിന്റെ വലിയൊരു ലോകമാണ്",
    "മൊബൈൽ ഫോൺ ഇന്ന് എല്ലാവരും ഉപയോഗിക്കുന്നു",
    "ഓൺലൈൻ പഠനം വിദ്യാർത്ഥികൾക്ക് സഹായകരമാണ്",
    "പുതിയ സാങ്കേതികവിദ്യകൾ ദിവസവും വികസിക്കുന്നു",
    "പ്രോഗ്രാമിംഗ് പഠിക്കുന്നത് പുതിയ അവസരങ്ങൾ നൽകുന്നു",
    "കമ്പ്യൂട്ടർ ഉപയോഗിക്കാൻ അടിസ്ഥാന അറിവ് ആവശ്യമാണ്",
    "വെബ്സൈറ്റ് നിർമ്മിക്കുന്നത് രസകരമായ കാര്യമാണ്",
    "പുതിയ സാങ്കേതികവിദ്യകൾ പഠിക്കാൻ താൽപര്യം വേണം",
    "ഇന്റർനെറ്റിൽ ലഭിക്കുന്ന വിവരങ്ങൾ പരിശോധിക്കണം",
    "സാങ്കേതികവിദ്യ ശരിയായ രീതിയിൽ ഉപയോഗിക്കണം",
    "ഡിജിറ്റൽ ലോകത്ത് സുരക്ഷ വളരെ പ്രധാനമാണ്",
    "പുതിയ കാര്യങ്ങൾ പഠിക്കാൻ ഓൺലൈൻ വിഭവങ്ങൾ ഉപയോഗിക്കാം",
    "സാങ്കേതികവിദ്യ വിദ്യാഭ്യാസ രംഗത്തും വലിയ മാറ്റങ്ങൾ ഉണ്ടാക്കി",

    "നല്ല ആരോഗ്യത്തിന് ശരിയായ ഭക്ഷണം ആവശ്യമാണ്",
    "ദിവസവും ആവശ്യത്തിന് വെള്ളം കുടിക്കണം",
    "പഴങ്ങളും പച്ചക്കറികളും ഭക്ഷണത്തിൽ ഉൾപ്പെടുത്തണം",
    "രാവിലെ വ്യായാമം ചെയ്യുന്നത് നല്ലതാണ്",
    "നല്ല ഉറക്കം ശരീരത്തിന് ആവശ്യമാണ്",
    "ശുചിത്വം ആരോഗ്യത്തിന് വളരെ പ്രധാനമാണ്",
    "വീടും പരിസരവും വൃത്തിയായി സൂക്ഷിക്കണം",
    "ദിവസവും കുറച്ചുസമയം നടക്കാൻ ശ്രമിക്കണം",
    "വ്യായാമം ശരീരത്തിന് ഉന്മേഷം നൽകുന്നു",
    "ആരോഗ്യകരമായ ശീലങ്ങൾ ചെറുപ്പത്തിൽ തന്നെ വളർത്തണം",
    "ശരീരത്തിനും മനസ്സിനും വിശ്രമം ആവശ്യമാണ്",
    "ആരോഗ്യകരമായ ജീവിതത്തിന് നല്ല ശീലങ്ങൾ വേണം",
    "വ്യായാമത്തോടൊപ്പം ശരിയായ ഭക്ഷണവും ആവശ്യമാണ്",
    "ആരോഗ്യം സംരക്ഷിക്കാൻ ശ്രദ്ധ വേണം",
    "ശരീരത്തെ ആരോഗ്യത്തോടെ സൂക്ഷിക്കുന്നത് നമ്മുടെ ഉത്തരവാദിത്വമാണ്",

    "വിജയിക്കാൻ കഠിനമായി പരിശ്രമിക്കണം",
    "ശ്രമിക്കുന്നവർക്ക് വിജയം നേടാൻ കഴിയും",
    "പരാജയപ്പെട്ടാൽ വീണ്ടും ശ്രമിക്കണം",
    "തെറ്റുകളിൽ നിന്ന് പഠിക്കണം",
    "ഓരോ പരാജയവും ഒരു പാഠമാണ്",
    "സ്വന്തം കഴിവുകളിൽ വിശ്വാസം ഉണ്ടായിരിക്കണം",
    "ലക്ഷ്യത്തിലേക്ക് സ്ഥിരമായി മുന്നോട്ട് പോകണം",
    "ചെറിയ ശ്രമങ്ങൾ വലിയ മാറ്റങ്ങൾ ഉണ്ടാക്കും",
    "സമയം ശരിയായി ഉപയോഗിക്കണം",
    "ഓരോ ദിവസവും പുതിയൊരു അവസരമാണ്",
    "നല്ല ശീലങ്ങൾ ജീവിതത്തെ മാറ്റുന്നു",
    "സ്വപ്നങ്ങൾ സാക്ഷാത്കരിക്കാൻ പരിശ്രമിക്കണം",
    "ബുദ്ധിമുട്ടുകൾ നമ്മെ കൂടുതൽ ശക്തരാക്കുന്നു",
    "പ്രശ്നങ്ങൾക്ക് പരിഹാരം കണ്ടെത്താൻ ശ്രമിക്കണം",
    "ആത്മവിശ്വാസത്തോടെ മുന്നോട്ട് പോകണം",
    "ക്ഷമയോടെ പ്രവർത്തിച്ചാൽ നല്ല ഫലം ലഭിക്കും",
    "തുടർച്ചയായ പരിശ്രമം വിജയത്തിലേക്ക് നയിക്കും",
    "ഇന്നത്തെ പരിശ്രമം നാളത്തെ വിജയമാണ്",
    "സ്വന്തം കഴിവുകൾ ദിവസവും മെച്ചപ്പെടുത്തണം",
    "ഒരിക്കലും ശ്രമം ഉപേക്ഷിക്കരുത്",

    "മറ്റുള്ളവരോട് സ്നേഹത്തോടെ പെരുമാറണം",
    "ആവശ്യമുള്ളവരെ കഴിയുന്നത്ര സഹായിക്കണം",
    "മറ്റുള്ളവരുടെ അഭിപ്രായങ്ങളെ ബഹുമാനിക്കണം",
    "നല്ല വാക്കുകൾ മറ്റുള്ളവർക്ക് സന്തോഷം നൽകും",
    "ഒരു ചെറിയ പുഞ്ചിരി പോലും വലിയ മാറ്റം ഉണ്ടാക്കും",
    "കരുണയോടെ പെരുമാറുന്നത് നല്ല മനുഷ്യഗുണമാണ്",
    "മറ്റുള്ളവരുടെ വിജയത്തിൽ സന്തോഷിക്കണം",
    "ആരെയും അനാവശ്യമായി വേദനിപ്പിക്കരുത്",
    "തെറ്റ് ചെയ്താൽ ക്ഷമ ചോദിക്കണം",
    "മറ്റുള്ളവരെ ശ്രദ്ധയോടെ കേൾക്കണം",
    "പരസ്പര ബഹുമാനം നല്ല ബന്ധങ്ങൾക്ക് ആവശ്യമാണ്",
    "വിശ്വാസം നല്ല ബന്ധങ്ങളുടെ അടിത്തറയാണ്",
    "സന്തോഷം മറ്റുള്ളവരുമായി പങ്കിടണം",
    "നല്ലൊരു വാക്ക് ഒരാളുടെ ദിവസം മാറ്റിയേക്കാം",
];

const allPracticeWords = MALAYALAM_SENTENCES.flatMap((sentence) => sentence.split(/\s+/));

function getGraphemeClusters(text: string) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter("ml", { granularity: "grapheme" });
        return Array.from(segmenter.segment(text)).map((s) => ({
            text: s.segment,
            startIndex: s.index,
            endIndex: s.index + s.segment.length,
        }));
    }
    return text.split("").map((char, index) => ({
        text: char,
        startIndex: index,
        endIndex: index + 1,
    }));
}

function shuffle(array: string[]): string[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

let globalAudioCtx: AudioContext | null = null;

function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!globalAudioCtx) {
        const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
            globalAudioCtx = new AudioContextClass();
        }
    }
    return globalAudioCtx;
}

function playSyntheticClick(code?: string) {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === "suspended") {
        void ctx.resume();
    }
    
    try {
        const pitchMultiplier = 0.96 + Math.random() * 0.08; 
        
        let freq1 = 1500;
        let freq2 = 280;
        let decayTime = 0.025;
        let volume2 = 0.08;
        
        if (code === "Space") {
            freq1 = 1100;
            freq2 = 180;
            decayTime = 0.035;
            volume2 = 0.12;
        } else if (
            code === "Backspace" || 
            code === "Enter" || 
            code === "ShiftLeft" || 
            code === "ShiftRight" || 
            code === "CapsLock" || 
            code === "Tab"
        ) {
            freq1 = 1300;
            freq2 = 220;
            decayTime = 0.03;
            volume2 = 0.09;
        }
        
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq1 * pitchMultiplier, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(700 * pitchMultiplier, ctx.currentTime + 0.006);
        gain1.gain.setValueAtTime(0.04, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.006);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq2 * pitchMultiplier, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(80 * pitchMultiplier, ctx.currentTime + decayTime);
        gain2.gain.setValueAtTime(volume2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decayTime);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc1.start();
        osc1.stop(ctx.currentTime + 0.006);
        osc2.start();
        osc2.stop(ctx.currentTime + decayTime);
    } catch {
        // ignore
    }
}

// Build standard Inscript reverse mapping for typed characters
const reverseMap: Record<string, { code: string; label: string; shift?: boolean }> = {};

for (const [code, def] of Object.entries(malayalamKeyMap)) {
    if (def.normal && def.normal.length === 1) {
        reverseMap[def.normal] = {
            code,
            label: code.replace("Key", "").replace("Digit", ""),
            shift: false,
        };
    }
    if (def.shift && def.shift.length === 1) {
        reverseMap[def.shift] = {
            code,
            label: code.replace("Key", "").replace("Digit", ""),
            shift: true,
        };
    }
}

// Ensure key maps match the trainer-lessons definitions and Direct Inscript conjuncts
reverseMap["ക്ഷ"] = { code: "Digit5", label: "5", shift: true };
reverseMap["അ"] = { code: "KeyD", label: "D", shift: true };
reverseMap["ആ"] = { code: "KeyE", label: "E", shift: true };
reverseMap["ഇ"] = { code: "KeyF", label: "F", shift: true };
reverseMap["ഉ"] = { code: "KeyG", label: "G", shift: true };
reverseMap["എ"] = { code: "KeyZ", label: "Z", shift: true };
reverseMap["ഒ"] = { code: "Digit1", label: "1", shift: false };
reverseMap["ഓ"] = { code: "Digit1", label: "1", shift: true };
reverseMap["ഔ"] = { code: "KeyQ", label: "Q", shift: true };
reverseMap["ഐ"] = { code: "KeyW", label: "W", shift: true };
reverseMap["ഈ"] = { code: "KeyR", label: "R", shift: true };
reverseMap["ഊ"] = { code: "KeyT", label: "T", shift: true };
reverseMap["ഏ"] = { code: "KeyS", label: "S", shift: true };
reverseMap[" "] = { code: "Space", label: "space", shift: false };

function getMalayalamCharFromKey(code: string, shift: boolean): string | null {
    const def = malayalamKeyMap[code];
    if (!def) return null;
    return shift && def.shift ? def.shift : (def.normal ?? null);
}


export default function PracticeArea() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);

    const [selectedDuration, setSelectedDuration] = useState(30);
    const [words, setWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [typedChars, setTypedChars] = useState("");
    const [history, setHistory] = useState<string[]>([]);

    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [pressedKeys, setPressedKeys] = useState<string[]>([]);
    const [wrongFlash, setWrongFlash] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Leaderboard states
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [leaderboardName, setLeaderboardName] = useState("");
    const [isSubmittingScore, setIsSubmittingScore] = useState(false);
    const [scoreSubmitted, setScoreSubmitted] = useState(false);
    const [leaderboardScores, setLeaderboardScores] = useState<Array<{ id: string; username: string; wpm: number; accuracy: number; created_at: string }>>([]);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

    // Load auth status
    useEffect(() => {
        async function loadUser() {
            try {
                const response = await fetch("/api/progress", { cache: "no-store" });
                const payload = await response.json() as { authenticated: boolean; user?: { username: string } };
                if (payload.authenticated && payload.user) {
                    setIsSignedIn(true);
                    setUsername(payload.user.username);
                }
            } catch {
                // ignore
            }
        }
        void loadUser();
    }, []);

    // Initial word generation
    useEffect(() => {
        window.setTimeout(() => {
            const initialSentences = [];
            for (let i = 0; i < 15; i++) {
                const s = MALAYALAM_SENTENCES[Math.floor(Math.random() * MALAYALAM_SENTENCES.length)];
                initialSentences.push(s);
            }
            setWords(initialSentences.join(" ").split(/\s+/));
        }, 0);
    }, []);

    // Check screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Auto scroll the container to keep current word in view
    useEffect(() => {
        if (!containerRef.current) return;
        const activeWordEl = containerRef.current.querySelector('[data-active="true"]') as HTMLElement;
        if (activeWordEl) {
            const container = containerRef.current;
            const activeOffsetTop = activeWordEl.offsetTop;
            
            if (activeOffsetTop > 60) {
                container.scrollTo({
                    top: activeOffsetTop - 50,
                    behavior: "smooth"
                });
            } else {
                container.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
    }, [currentWordIndex]);

    const playKeySound = useCallback((code?: string) => {
        if (soundEnabled) {
            playSyntheticClick(code);
        }
    }, [soundEnabled]);

    // Timer trigger
    useEffect(() => {
        if (!started || finished) return;

        const interval = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    window.clearInterval(interval);
                    setFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(interval);
    }, [started, finished]);

    // Calculate typing statistics
    const stats = useMemo(() => {
        let correct = 0;
        let incorrect = 0;

        // Process completed words
        history.forEach((typed, idx) => {
            const target = words[idx];
            if (!target) return;
            const maxLen = Math.max(typed.length, target.length);
            for (let i = 0; i < maxLen; i++) {
                if (typed[i] === target[i]) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        });

        // Process current word
        const currentTarget = words[currentWordIndex];
        if (currentTarget && typedChars.length > 0) {
            for (let i = 0; i < typedChars.length; i++) {
                if (typedChars[i] === currentTarget[i]) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        }

        const total = correct + incorrect;
        const acc = total > 0 ? Math.round((correct / total) * 100) : 100;
        const timeElapsed = selectedDuration - timeLeft;
        const wpm = timeElapsed > 0 ? Math.round((correct / 5) / (timeElapsed / 60)) : 0;

        return { correct, incorrect, wpm, acc, totalKeys: total };
    }, [history, words, currentWordIndex, typedChars, selectedDuration, timeLeft]);

    const fetchLeaderboard = useCallback(async () => {
        setIsLoadingLeaderboard(true);
        try {
            const res = await fetch(`/api/leaderboard?duration=${selectedDuration}`, { cache: "no-store" });
            const data = await res.json() as { scores: typeof leaderboardScores };
            setLeaderboardScores(data.scores || []);
        } catch {
            // ignore
        } finally {
            setIsLoadingLeaderboard(false);
        }
    }, [selectedDuration]);

    const handleSubmitScore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmittingScore || scoreSubmitted) return;

        setIsSubmittingScore(true);
        try {
            const res = await fetch("/api/leaderboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: leaderboardName || "Guest",
                    wpm: stats.wpm,
                    accuracy: stats.acc,
                    duration: selectedDuration,
                }),
            });
            if (res.ok) {
                setScoreSubmitted(true);
                void fetchLeaderboard();
            }
        } catch {
            // ignore
        } finally {
            setIsSubmittingScore(false);
        }
    };

    // Re-fetch leaderboard on finish
    useEffect(() => {
        if (finished) {
            window.setTimeout(() => {
                void fetchLeaderboard();
                if (isSignedIn && username) {
                    setLeaderboardName(username);
                } else {
                    setLeaderboardName("");
                }
                setScoreSubmitted(false);
            }, 0);
        }
    }, [finished, isSignedIn, username, fetchLeaderboard]);

    const handleRestart = useCallback(() => {
        const initialSentences = [];
        for (let i = 0; i < 15; i++) {
            const s = MALAYALAM_SENTENCES[Math.floor(Math.random() * MALAYALAM_SENTENCES.length)];
            initialSentences.push(s);
        }
        setWords(initialSentences.join(" ").split(/\s+/));
        setCurrentWordIndex(0);
        setTypedChars("");
        setHistory([]);
        setStarted(false);
        setFinished(false);
        setTimeLeft(selectedDuration);
        setPressedKeys([]);
        setWrongFlash(false);
    }, [selectedDuration]);

    const handleDurationChange = (duration: number) => {
        if (started) return;
        setSelectedDuration(duration);
        setTimeLeft(duration);
    };

    // Main input processor
    const processInput = useCallback((code: string, shiftPressed: boolean) => {
        if (finished) return;

        if (!started) {
            setStarted(true);
        }

        if (code === "Backspace") {
            playKeySound("Backspace");
            setTypedChars((prev) => prev.slice(0, -1));
            return;
        }

        if (code === "Space") {
            playKeySound("Space");
            if (typedChars.length > 0) {
                // If we are getting near the end of loaded sentences, append more random sentences!
                if (currentWordIndex >= words.length - 15) {
                    const extraSentences = [];
                    for (let i = 0; i < 10; i++) {
                        const s = MALAYALAM_SENTENCES[Math.floor(Math.random() * MALAYALAM_SENTENCES.length)];
                        extraSentences.push(s);
                    }
                    const newWords = extraSentences.join(" ").split(/\s+/);
                    setWords((prev) => [...prev, ...newWords]);
                }
                setHistory((prev) => [...prev, typedChars]);
                setCurrentWordIndex((prev) => prev + 1);
                setTypedChars("");
            }
            return;
        }

        const mChar = getMalayalamCharFromKey(code, shiftPressed);
        if (mChar === null) return; // Ignore keys that don't map to anything

        playKeySound(code);
        setTypedChars((prev) => {
            const nextVal = prev + mChar;
            const currentTarget = words[currentWordIndex] ?? "";
            
            // Highlight a quick wrong flash if the typed character is wrong at its index
            const currentIndex = prev.length;
            if (currentTarget[currentIndex] !== mChar) {
                setWrongFlash(true);
                window.setTimeout(() => setWrongFlash(false), 150);
            }
            
            return nextVal;
        });

        // Highlight virtual keycap visually
        const activeCodes = shiftPressed ? [code, "ShiftLeft"] : [code];
        setPressedKeys((current) => [...new Set([...current, ...activeCodes])]);
        window.setTimeout(() => {
            setPressedKeys((current) => current.filter((item) => !activeCodes.includes(item)));
        }, 120);

    }, [started, finished, currentWordIndex, words, typedChars, playKeySound]);

    // Keyboard listener
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat || finished) return;

            // Prevent scroll or page actions for key inputs inside the trainer area
            if (
                event.code === "Space" ||
                event.code === "Backspace" ||
                (event.code.startsWith("Key") && !event.ctrlKey && !event.metaKey) ||
                event.code.startsWith("Digit")
            ) {
                event.preventDefault();
            }

            if (
                event.code === "ShiftLeft" ||
                event.code === "ShiftRight" ||
                event.code === "ControlLeft" ||
                event.code === "ControlRight" ||
                event.code === "AltLeft" ||
                event.code === "AltRight" ||
                event.code === "MetaLeft" ||
                event.code === "MetaRight" ||
                event.code === "CapsLock"
            ) {
                return;
            }

            if (isMobile) return;

            processInput(event.code, event.shiftKey);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [finished, processInput, isMobile]);

    // Handle hidden input for mobile keyboard access
    const handleHiddenInput = useCallback((event: React.FormEvent<HTMLInputElement>) => {
        const val = event.currentTarget.value;
        if (!val) return;
        event.currentTarget.value = "";

        const char = val.slice(-1);
        let code = "";
        let shiftPressed = false;

        if (char === " ") {
            code = "Space";
        } else if (char === "Backspace") {
            code = "Backspace";
        } else if (/[a-zA-Z]/.test(char)) {
            code = `Key${char.toUpperCase()}`;
            shiftPressed = char === char.toUpperCase();
        } else {
            // Find map for exact malayalam letter if mobile input sends Malayalam characters
            const mapEntry = Object.entries(malayalamKeyMap).find(
                (entry) => entry[1].normal === char || entry[1].shift === char
            );
            if (mapEntry) {
                code = mapEntry[0];
                shiftPressed = mapEntry[1].shift === char;
            } else {
                return;
            }
        }

        processInput(code, shiftPressed);
    }, [processInput]);


    return (
        <div className="space-y-4">
            {/* Minimal Centered Controls */}
            {!finished && (
                <div className="flex justify-center items-center gap-4 py-2">
                    {/* Time Selection */}
                    <div className="inline-flex rounded-full border-2 border-black bg-white p-0.5 shadow-[2px_2px_0px_black]">
                        {[15, 30, 60].map((sec) => (
                            <button
                                key={sec}
                                type="button"
                                disabled={started}
                                onClick={() => handleDurationChange(sec)}
                                className={`rounded-full px-3 py-1 text-xs font-black transition-all ${
                                    selectedDuration === sec
                                        ? "bg-black text-white"
                                        : "text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                                }`}
                            >
                                {sec}s
                            </button>
                        ))}
                    </div>

                    {/* Sound Toggle */}
                    <button
                        type="button"
                        onClick={() => setSoundEnabled((prev) => !prev)}
                        className={`inline-flex items-center justify-center rounded-full border-2 border-black p-2 shadow-[2px_2px_0px_black] active:translate-y-0.5 active:shadow-none transition-all ${
                            soundEnabled ? "bg-[#c084fc] text-black" : "bg-red-50 text-red-500"
                        }`}
                        title={soundEnabled ? "Mute Click Sound" : "Enable Click Sound"}
                    >
                        {soundEnabled ? <IconVolume size={16} /> : <IconVolumeOff size={16} />}
                    </button>

                    {/* Reset Button */}
                    <button
                        type="button"
                        onClick={handleRestart}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black shadow-[2px_2px_0px_black] hover:bg-slate-50 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        <IconReload size={14} stroke={2.5} />
                        Reset
                    </button>
                </div>
            )}

            {/* Main Interactive Typing Area */}
            {!finished ? (
                <div 
                    onClick={() => {
                        if (hiddenInputRef.current) {
                            hiddenInputRef.current.focus();
                        }
                    }}
                    className={`relative rounded-[1.8rem] md:rounded-[2.4rem] border-2 md:border-[3px] border-black bg-[#dff6fb] p-4 md:p-6 shadow-[2px_2px_0px_black] md:shadow-[4px_4px_0px_black] transition-all cursor-text min-h-[260px] md:min-h-[300px] flex flex-col justify-between ${
                        isInputFocused ? "ring-2 ring-purple-600/50" : ""
                    }`}
                >
                    {/* Real-time stats display */}
                    <div className="flex items-center justify-between border-b-2 border-black/10 pb-3 md:pb-4 mb-3 md:mb-4">
                        <div className="flex items-center gap-2 md:gap-4 text-slate-800">
                            <div className="flex items-center gap-1 bg-white border-2 border-black px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-black shadow-[1.5px_1.5px_0px_black]">
                                <IconClock size={12} className={`md:w-3.5 md:h-3.5 ${timeLeft < 6 && started ? "text-red-500 animate-pulse" : ""}`} />
                                <span>{timeLeft}s</span>
                            </div>
                            <div className="flex items-center gap-1 bg-white border-2 border-black px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-black shadow-[1.5px_1.5px_0px_black]">
                                <span className="text-slate-500 hidden sm:inline">SPEED:</span>
                                <span>{stats.wpm} WPM</span>
                            </div>
                            <div className="flex items-center gap-1 bg-white border-2 border-black px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-black shadow-[1.5px_1.5px_0px_black]">
                                <span className="text-slate-500 hidden sm:inline">ACC:</span>
                                <span>{stats.acc}%</span>
                            </div>
                        </div>
                        <div className="hidden sm:block text-[10px] uppercase font-black tracking-widest text-slate-400">
                            {started ? "TYPING..." : "READY TO START"}
                        </div>
                    </div>

                    {/* Hidden input element for focus on mobile */}
                    <input
                        ref={hiddenInputRef}
                        type="text"
                        className="absolute opacity-0 w-0 h-0 pointer-events-none"
                        value=""
                        onChange={handleHiddenInput}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                    />

                    {/* Focus Shield (Monkeytype styling overlay) */}
                    {!isInputFocused && (
                        <div className="absolute inset-0 bg-white/25 rounded-[1.8rem] md:rounded-[2.4rem] backdrop-blur-[2px] flex items-center justify-center z-15 transition-all">
                            <div className="rounded-[1.2rem] border-2 md:border-[3px] border-black bg-white px-4 md:px-6 py-2.5 md:py-3 shadow-[1.5px_1.5px_0px_black] md:shadow-[2px_2px_0px_black] text-center max-w-xs md:max-w-sm">
                                <IconKeyboard size={28} className="mx-auto text-slate-800 animate-bounce" />
                                <h3 className="mt-2 text-sm font-black text-slate-900">Click here to focus</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">
                                    Click anywhere inside this box or press any key to resume typing practice.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Word display box */}
                    <div 
                        ref={containerRef}
                        className="relative flex-1 min-h-[200px] max-h-[50VH] overflow-hidden leading-[1.8] md:leading-[2.2] select-none"
                    >
                        <div className="flex flex-wrap gap-x-3 md:gap-x-5 gap-y-4 md:gap-y-6 px-3 md:px-8 py-3 md:py-4 items-center">
                            {words.map((word, wordIdx) => {
                                const isCurrent = wordIdx === currentWordIndex;
                                const isPassed = wordIdx < currentWordIndex;
                                const typedVal = isCurrent ? typedChars : (history[wordIdx] ?? "");
                                
                                return (
                                    <div
                                        key={wordIdx}
                                        data-active={isCurrent}
                                        className={`font-malayalam text-base md:text-3xl font-semibold relative py-1 rounded transition-all duration-150 flex items-center ${
                                            isCurrent 
                                                ? "bg-black/5 ring-1 ring-black/10 px-2 -mx-2 scale-105" 
                                                : "text-[#bdd0db]"
                                        }`}
                                    >
                                        {isPassed ? (
                                            /* Finished Word: Render as single string to prevent diacritic splitting */
                                            <span className={history[wordIdx] === word ? "text-slate-800 font-bold" : "text-red-500 font-bold border-b-2 border-red-500"}>
                                                {word}
                                            </span>
                                        ) : isCurrent ? (
                                            /* Active Word: Render with grapheme clusters to prevent diacritic splitting */
                                            getGraphemeClusters(word).map((cluster, clusterIdx) => {
                                                const isFullyTyped = cluster.endIndex <= typedVal.length;
                                                const isActive = cluster.startIndex <= typedVal.length && typedVal.length < cluster.endIndex;
                                                
                                                let letterColor = "text-slate-400";
                                                
                                                if (isFullyTyped) {
                                                    const typedPart = typedVal.slice(cluster.startIndex, cluster.endIndex);
                                                    const targetPart = cluster.text;
                                                    const isCorrect = typedPart === targetPart;
                                                    letterColor = isCorrect ? "text-slate-800 font-bold" : "text-red-500 font-bold border-b-2 border-red-500";
                                                } else if (isActive) {
                                                    letterColor = wrongFlash 
                                                        ? "text-red-500 font-black animate-pulse" 
                                                        : "text-purple-600 font-bold";
                                                }
 
                                                return (
                                                    <span key={clusterIdx} className={`${letterColor} transition-colors duration-100 whitespace-pre relative`}>
                                                        {/* Custom Blinking Cursor */}
                                                        {isActive && (
                                                            <span className="inline-block w-[2px] md:w-[3px] h-[1rem] md:h-[1.8rem] bg-purple-600 animate-[pulse_0.8s_infinite] absolute -ml-[2px]" />
                                                        )}
                                                        {cluster.text}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            /* Future Word: Render as single string */
                                            <span className="text-[#bdd0db]">
                                                {word}
                                            </span>
                                        )}
 
                                        {/* Extra typed letters beyond word length */}
                                        {isCurrent && typedVal.length > word.length && (
                                            <span className="text-red-500 font-bold line-through ml-0.5 whitespace-pre">
                                                {typedVal.slice(word.length)}
                                            </span>
                                        )}
 
                                        {/* Cursor at the end of the word if user has typed all letters or extra letters */}
                                        {isCurrent && typedVal.length >= word.length && (
                                            <span className="inline-block w-[2px] md:w-[3px] h-[1rem] md:h-[1.8rem] bg-purple-600 animate-[pulse_0.8s_infinite] absolute" 
                                                  style={{ left: `${word.length * (isMobile ? 0.52 : 1.05) + (typedVal.length - word.length) * (isMobile ? 0.35 : 0.7)}rem` }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                /* Results Screen & Leaderboard Layout */
                <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-stretch">
                    {/* Left: Stats & Submit Form */}
                    <section className="flex-1 rounded-[2.4rem] border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_black] text-center flex flex-col justify-between space-y-6">
                        <div>
                            <div className="mx-auto inline-flex items-center justify-center p-3 rounded-full bg-yellow-300 border-[3px] border-black text-black animate-bounce">
                                <IconTrophy size={42} stroke={2.5} />
                            </div>
                            
                            <div className="mt-4">
                                <h2 className="text-3xl font-black text-slate-900">Practice Completed!</h2>
                                <p className="text-sm font-semibold text-slate-500 mt-1">
                                    Your performance over the {selectedDuration}-second session.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="rounded-[1.5rem] border-[3px] border-black bg-[#eaf9fc] p-4 shadow-[4px_4px_0px_black]">
                                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">SPEED</p>
                                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.wpm}</h3>
                                    <p className="text-xs font-bold text-slate-600">Words/Min</p>
                                </div>
                                <div className="rounded-[1.5rem] border-[3px] border-black bg-[#edf9fb] p-4 shadow-[4px_4px_0px_black]">
                                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">ACCURACY</p>
                                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.acc}%</h3>
                                    <p className="text-xs font-bold text-slate-600">Accuracy Rate</p>
                                </div>
                                <div className="rounded-[1.5rem] border-[3px] border-black bg-[#eefdeb] p-4 shadow-[4px_4px_0px_black]">
                                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">CORRECT KEYS</p>
                                    <h3 className="text-3xl font-black text-green-700 mt-1">{stats.correct}</h3>
                                    <p className="text-xs font-bold text-slate-600">Keys typed right</p>
                                </div>
                                <div className="rounded-[1.5rem] border-[3px] border-black bg-[#ffe3de] p-4 shadow-[4px_4px_0px_black]">
                                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">MISTAKES</p>
                                    <h3 className="text-3xl font-black text-red-600 mt-1">{stats.incorrect}</h3>
                                    <p className="text-xs font-bold text-slate-600">Incorrect keys</p>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Submit Section */}
                        <div className="border-t-2 border-black/10 pt-6">
                            {scoreSubmitted ? (
                                <div className="rounded-[1rem] border-2 border-green-500 bg-green-50 px-4 py-3 text-green-800 font-bold text-xs inline-flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(34,197,94,1)]">
                                    🎉 Score submitted successfully!
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitScore} className="max-w-md mx-auto space-y-3">
                                    <p className="text-xs font-black text-slate-600 uppercase tracking-wider">
                                        Submit Score to Leaderboard
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={leaderboardName}
                                            onChange={(e) => setLeaderboardName(e.target.value)}
                                            placeholder={isSignedIn && username ? username : "Enter your nickname"}
                                            disabled={isSubmittingScore || (isSignedIn && !!username)}
                                            maxLength={20}
                                            className="flex-1 rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold shadow-[2px_2px_0px_black] focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmittingScore || (!isSignedIn && !leaderboardName.trim())}
                                            className="rounded-full border-2 border-black bg-[#c084fc] px-4 py-2 text-xs font-black shadow-[2px_2px_0px_black] hover:bg-[#b070ec] disabled:opacity-50 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                        >
                                            {isSubmittingScore ? "Submitting..." : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 border-t-2 border-black/10 pt-6">
                            <button
                                type="button"
                                onClick={handleRestart}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-black bg-[#78db9e] px-6 py-3 text-sm font-black text-slate-800 shadow-[3px_3px_0px_black] hover:bg-[#68cb8e] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                            >
                                <IconReload size={16} stroke={2.5} />
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-black bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-[3px_3px_0px_black] hover:bg-slate-50 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                            >
                                <IconHome size={16} stroke={2.5} />
                                Back to Lessons Map
                            </Link>
                        </div>
                    </section>

                    {/* Right: Leaderboard Rankings */}
                    <div className="flex-1 rounded-[2.4rem] border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_black] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 border-b-2 border-black/10 pb-4">
                                <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-yellow-300 border-2 border-black text-black">
                                    🏆
                                </span>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                                    TOP 10 LEADERBOARD ({selectedDuration}s)
                                </h3>
                            </div>
                            
                            {isLoadingLeaderboard ? (
                                <div className="py-16 text-center text-slate-500 font-bold text-sm animate-pulse">
                                    Loading scores...
                                </div>
                            ) : leaderboardScores.length === 0 ? (
                                <div className="py-16 text-center text-slate-400 font-medium text-sm">
                                    No scores yet. Be the first to claim a spot!
                                </div>
                            ) : (
                                <div className="mt-4 overflow-hidden rounded-[1.2rem] border-[3px] border-black bg-white shadow-[4px_4px_0px_black]">
                                    <table className="w-full text-left text-xs font-bold text-slate-700">
                                        <thead>
                                            <tr className="border-b-2 border-black bg-[#edf9fb] text-slate-500 font-black">
                                                <th className="px-3 py-2 text-center w-12 border-r-2 border-black">#</th>
                                                <th className="px-4 py-2 border-r-2 border-black">Name</th>
                                                <th className="px-3 py-2 text-center w-20 border-r-2 border-black">WPM</th>
                                                <th className="px-3 py-2 text-center w-20">Acc</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaderboardScores.map((score, index) => {
                                                const isTop3 = index < 3;
                                                const medals = ["🥇", "🥈", "🥉"];
                                                const bgColors = ["bg-yellow-50", "bg-slate-50", "bg-amber-50/50", ""];
                                                return (
                                                    <tr key={score.id} className={`border-b-2 border-black/10 last:border-b-0 hover:bg-slate-50/80 ${bgColors[isTop3 ? index : 3]}`}>
                                                        <td className="px-3 py-2 text-center border-r-2 border-black/10">
                                                            {isTop3 ? medals[index] : index + 1}
                                                        </td>
                                                        <td className="px-4 py-2 truncate max-w-[150px] border-r-2 border-black/10 font-bold text-slate-800" title={score.username}>
                                                            {score.username}
                                                        </td>
                                                        <td className="px-3 py-2 text-center border-r-2 border-black/10 text-slate-900 font-black">
                                                            {score.wpm}
                                                        </td>
                                                        <td className="px-3 py-2 text-center text-slate-500">
                                                            {score.accuracy}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
