(function(d){	const l = d['cs'] = d['cs'] || {};	l.dictionary=Object.assign(		l.dictionary||{},		{"%0 of %1":"%0 z %1","Block quote":"Citace",Bold:"Tučné","Bulleted List":"Odrážky",Cancel:"Zrušit","Centered image":"Obrázek zarovnaný na střed","Change image text alternative":"Změnit alternativní text obrázku","Choose heading":"Zvolte nadpis",Column:"Sloupec","Decrease indent":"Zmenšit odsazení","Delete column":"Smazat sloupec","Delete row":"Smazat řádek",Downloadable:"Ke stažení","Dropdown toolbar":"Rozbalovací panel nástrojů","Edit link":"Upravit odkaz","Editor toolbar":"Panel nástrojů editoru","Enter image caption":"Zadejte popis obrázku","Full size image":"Obrázek v plné velikosti","Header column":"Sloupec záhlaví","Header row":"Řádek záhlaví",Heading:"Nadpis","Heading 1":"Nadpis 1","Heading 2":"Nadpis 2","Heading 3":"Nadpis 3","Heading 4":"Nadpis 4","Heading 5":"Nadpis 5","Heading 6":"Nadpis 6","Image toolbar":"Panel nástrojů obrázku","image widget":"ovládací prvek obrázku","Increase indent":"Zvětšit odsazení","Insert column left":"Vložit sloupec vlevo","Insert column right":"Vložit sloupec vpravo","Insert image":"Vložit obrázek","Insert media":"Vložit média","Insert paragraph after block":"","Insert paragraph before block":"","Insert row above":"Vložit řádek před","Insert row below":"Vložit řádek pod","Insert table":"Vložit tabulku",Italic:"Kurzíva","Left aligned image":"Obrázek zarovnaný vlevo",Link:"Odkaz","Link URL":"URL odkazu","Media URL":"URL adresa","media widget":"ovládací prvek médií","Merge cell down":"Sloučit s buňkou pod","Merge cell left":"Sloučit s buňkou vlevo","Merge cell right":"Sloučit s buňkou vpravo","Merge cell up":"Sloučit s buňkou nad","Merge cells":"Sloučit buňky",Next:"Další","Numbered List":"Číslování","Open in a new tab":"Otevřít v nové kartě","Open link in new tab":"Otevřít odkaz v nové kartě",Paragraph:"Odstavec","Paste the media URL in the input.":"Vložte URL média do vstupního pole.",Previous:"Předchozí",Redo:"Znovu","Rich Text Editor":"Textový editor","Rich Text Editor, %0":"Textový editor, %0","Right aligned image":"Obrázek zarovnaný vpravo",Row:"Řádek",Save:"Uložit","Select all":"Vybrat vše","Select column":"Vybrat sloupec","Select row":"Vybrat řádek","Show more items":"Zobrazit další položky","Side image":"Postranní obrázek","Split cell horizontally":"Rozdělit buňky horizontálně","Split cell vertically":"Rozdělit buňky vertikálně","Table toolbar":"Panel nástrojů tabulky","Text alternative":"Alternativní text","The URL must not be empty.":"URL adresa musí být vyplněna.","This link has no URL":"Tento odkaz nemá žádnou URL","This media URL is not supported.":"Tato adresa bohužel není podporována.","Tip: Paste the URL into the content to embed faster.":"Rada: Vložte URL přímo do editoru pro rychlejší vnoření.",Undo:"Zpět",Unlink:"Odstranit odkaz","Upload failed":"Nahrání selhalo","Upload in progress":"Probíhá nahrávání","Widget toolbar":"Panel nástrojů ovládacího prvku"}	);l.getPluralForm=function(n){return (n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;;};})(window.CKEDITOR_TRANSLATIONS||(window.CKEDITOR_TRANSLATIONS={}));