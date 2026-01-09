
import { MapArea, Shape } from './types';

export const INDEX_IMAGE_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhte70ALtQcyrnaRRftms4GFuU5_yUtYjLCwF7EqF_EqH8wPS-Sv-MKHGXJ9njCHN4xZLOvIiQAMmK8V8ayZISmkUzTml07g8DYWimAu92T61PVaPGQAOUXnbVWkf-Fc-nzBeAUhXJCVpcp/s1600/Index+50+000+-+25+juin+2016.jpg";

const p = (c: string) => c.split(',').map(Number);

// Regions Constants
export const REGIONS = [
  "طنجة - تطوان - الحسيمة",
  "الشرق",
  "فاس - مكناس",
  "الرباط - سلا - القنيطرة",
  "بني ملال - خنيفرة",
  "الدار البيضاء - سطات",
  "مراكش - آسفي",
  "درعة - تافيلالت",
  "سوس - ماسة",
  "كلميم - واد نون",
  "العيون - الساقية الحمراء",
  "الداخلة - وادي الذهب"
];

export const MAP_DATA: MapArea[] = [
    { id: "1", name: "Tanger", shape: "rect" as Shape, coords: p("391,10,411,34"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAVTE4ejZ4OTNRVXc/view?usp=sharing", title: "1 : Tanger", region: "طنجة - تطوان - الحسيمة", province: "طنجة - أصيلة" },
    { id: "2", name: "Ksar Es Srhir", shape: "rect" as Shape, coords: p("412,10,431,34"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRATzVCYjlVNDhRZzA/view?usp=sharing", title: "2 : Ksar Es Srhir", region: "طنجة - تطوان - الحسيمة", province: "الفحص - أنجرة" },
    { id: "3", name: "Sebta ( Ceuta )", shape: "rect" as Shape, coords: p("432,8,451,33"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAa1dxb2FtbW5jdHM/view?usp=sharing", title: "3 : Sebta ( Ceuta )", region: "طنجة - تطوان - الحسيمة", province: "المضيق - الفنيدق" },
    { id: "4", name: "El Manzla", shape: "rect" as Shape, coords: p("391,35,412,58"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRALTVFSkVJN0VRbms/view?usp=sharing", title: "4 : El Manzla", region: "طنجة - تطوان - الحسيمة", province: "طنجة - أصيلة" },
    { id: "5", name: "Melloussa", shape: "rect" as Shape, coords: p("412,35,431,59"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAS19mUDFrTHYwNmM/view?usp=sharing", title: "5 : Melloussa", region: "طنجة - تطوان - الحسيمة", province: "الفحص - أنجرة" },
    { id: "6", name: "Tetouan", shape: "rect" as Shape, coords: p("432,34,452,58"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAWVBMYW1IVFNfRjA/view?usp=sharing", title: "6 : Tetouan", region: "طنجة - تطوان - الحسيمة", province: "تطوان" },
    { id: "7", name: "Ras Mazari", shape: "rect" as Shape, coords: p("452,33,472,58"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRALUUzNGJJako3Umc/view?usp=sharing", title: "7 : Ras Mazari", region: "طنجة - تطوان - الحسيمة", province: "شفشاون" },
    { id: "8", name: "Asilah", shape: "rect" as Shape, coords: p("372,59,392,84"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAUVQxUFlSeXV3d0k/view?usp=sharing", title: "8 : Asilah", region: "طنجة - تطوان - الحسيمة", province: "طنجة - أصيلة" },
    { id: "9", name: "Arba Ayacha", shape: "rect" as Shape, coords: p("393,58,412,84"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAUDFMQ3Z1WjFlU0k/view?usp=sharing", title: "9 : Arba Ayacha", region: "طنجة - تطوان - الحسيمة", province: "العرائش" },
    { id: "10", name: "Souk Khemis Des Beni Arouss", shape: "rect" as Shape, coords: p("413,59,432,83"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAX0tYLU1lV1YzSFU/view?usp=sharing", title: "10 : Souk Khemis Des Beni Arouss", region: "طنجة - تطوان - الحسيمة", province: "العرائش" },
    { id: "11", name: "Souk Larba Beni Hessane", shape: "rect" as Shape, coords: p("433,59,452,83"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAWmhUcmMxQUh6alU/view?usp=sharing", title: "11 : Souk Larba Beni Hessane", region: "طنجة - تطوان - الحسيمة", province: "تطوان" },
    { id: "15", name: "Larache", shape: "rect" as Shape, coords: p("372,85,393,108"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRASm9FNFMxSXVXcFE/view?usp=sharing", title: "15 : Larache", region: "طنجة - تطوان - الحسيمة", province: "العرائش" },
    { id: "47", name: "Sidi 'Allal Tazi", shape: "rect" as Shape, coords: p("352,134,374,158"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAcndUcV9fY09YaFk/view?usp=sharing", title: "47 : Sidi 'Allal Tazi", region: "الرباط - سلا - القنيطرة", province: "القنيطرة" },
    { id: "60", name: "Oujda", shape: "rect" as Shape, coords: p("720,121,739,145"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRASnhfUHM0V2x5YlE/view?usp=sharing", title: "60 : Oujda", region: "الشرق", province: "وجدة - أنجاد" },
    { id: "78", name: "Rabat", shape: "rect" as Shape, coords: p("313,183,334,208"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRATndJSzVyX2JxcFU/view?usp=sharing", title: "78 : Rabat", region: "الرباط - سلا - القنيطرة", province: "الرباط" },
    { id: "85", name: "Fes Ouest", shape: "rect" as Shape, coords: p("457,181,476,204"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRALVRESTFfdVdxdUk/view?usp=sharing", title: "85 : Fes Ouest", region: "فاس - مكناس", province: "فاس" },
    { id: "100", name: "Meknes", shape: "rect" as Shape, coords: p("417,206,436,230"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRANmpSS09VQWpDSG8/view?usp=sharing", title: "100 : Meknes", region: "فاس - مكناس", province: "مكناس" },
    { id: "113", name: "Casablanca", shape: "rect" as Shape, coords: p("253,233,272,258"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAODdqcHp6UHBlejg/view?usp=sharing", title: "113 : Casablanca", region: "الدار البيضاء - سطات", province: "الدار البيضاء" },
    { id: "214", name: "Safi", shape: "rect" as Shape, coords: p("128,356,150,378"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAemJDdTdRZ01oVlU/view?usp=sharing", title: "214 : Safi", region: "مراكش - آسفي", province: "آسفي" },
    { id: "224", name: "Beni Mellal", shape: "rect" as Shape, coords: p("358,355,378,378"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAMndYcTBOMzZuclk/view?usp=sharing", title: "224 : Beni Mellal", region: "بني ملال - خنيفرة", province: "بني ملال" },
    { id: "284", name: "Marrakech Gueliz", shape: "rect" as Shape, coords: p("214,430,233,453"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAOTJkUVc2QmFCWjQ/view?usp=sharing", title: "284 : Marrakech Gueliz", region: "مراكش - آسفي", province: "مراكش" },
    { id: "343", name: "Warzazat ( Ouarzazate )", shape: "rect" as Shape, coords: p("318,502,338,525"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAd0R2OURSV29kV0U/view?usp=sharing", title: "343 : Warzazat ( Ouarzazate )", region: "درعة - تافيلالت", province: "ورزازات" },
    { id: "360", name: "Agadir", shape: "rect" as Shape, coords: p("86,551,107,574"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRAeHRwZVhhdldDR1U/view?usp=sharing", title: "360 : Agadir", region: "سوس - ماسة", province: "أكادير إدا وتنان" },
    { id: "386", name: "Bou Izakarn", shape: "rect" as Shape, coords: p("85,673,105,697"), href: "https://drive.google.com/file/d/0B_qVkuJA2pRALW11MldQekF3Slk/view?usp=sharing", title: "386 : Bou Izakarn", region: "كلميم - واد نون", province: "كلميم" },
].sort((a, b) => {
    const parseId = (id: string) => {
        const match = id.match(/^(\d+)(.*)$/);
        if (!match) return [Infinity, id];
        return [parseInt(match[1], 10), match[2]];
    };
    const [numA, suffixA] = parseId(a.id);
    const [numB, suffixB] = parseId(b.id);
    if (numA !== numB) return (numA as number) - (numB as number);
    return (suffixA as string).localeCompare(suffixB as string);
});
