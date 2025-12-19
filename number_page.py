import pathlib 
lines=pathlib.Path('app/page.tsx').read_text(encoding='utf-8').splitlines() 
with open('numbered_page.txt','w',encoding='utf-8') as f: 
    for idx,line in enumerate(lines,1): 
        f.write(f\"{idx}:{line}\n\") 
