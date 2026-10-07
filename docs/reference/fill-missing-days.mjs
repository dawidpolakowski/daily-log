import fs from "fs";
const real = {
"2026-08-19":["Timecorder web app and API hardening",["Moved Timecorder further towards a web app and refactored the project view","Added a whiteboard to the project view and fixed login issues","Added bot/DoS rate limiting to the API and updated SEO on the website"],"timecorder, webapp, security"],
"2026-08-20":["Timecorder mind map",["Fixed the mind map and removed the nesting cap","Showed archived projects and allowed adding projects to the canvas","Made the UI responsive and added login protection"],"timecorder, mind-map, frontend"],
"2026-08-27":["Soundcorder first version",["Started the Soundcorder mobile app from scratch","Shipped a first version: record, organise and play sounds","Wrote the README"],"soundcorder, mobile, release"],
"2026-08-28":["Timecorder auth and hotfixes",["Added authentication to Timecorder and shipped a hotfix","Updated link logic and subtask handling","Added sharing and fixed a few bugs"],"timecorder, auth, bugfix"],
"2026-09-15":["Guinea pig game: swimming and leaderboard",["Added swimming, hearts, haystacks, sound and music","Added mobile support and a landing page","Built a global leaderboard"],"gamedev, guinea-pigs, release"],
"2026-09-17":["Guinea pig game: boss fight",["Added a Level 1 boss fight","Fixed the hearts/game-over bug and reskinned heart pickups to potions","Added real animation art, level locking and leaderboard stars"],"gamedev, guinea-pigs, art"],
"2026-09-18":["Guinea pig game: settings and hazards",["Added a settings screen and an unlimited item bar","Added a flying gull hazard","Drew new critter and item art"],"gamedev, guinea-pigs, polish"],
"2026-09-22":["Timecorder website and admin",["Updated the Timecorder website","Made project and admin updates"],"timecorder, website, webapp"],
"2026-09-23":["Lerayimages site rebuild kickoff",["Backed up the live Lerayimages site","Scaffolded an Astro demo of the new site"],"web design, astro, clients"],
"2026-09-25":["Crystal Mind: Calm mode and web port",["Added Calm mode, planetary chakra tuning and recorded chakra sounds","Fixed the ball, daily bonus and camera setup bugs","Started the web port with Vite, TypeScript and Phaser 3"],"gamedev, crystal-mind, phaser"],
"2026-09-28":["TypewriterX Pro",["Added Pro licensing and native window controls","Added a Git panel and inline comments","Switched to the EB Garamond font"],"typewriterx, release, desktop"],
"2026-09-29":["TypewriterX typewriter view",["Added a typewriter view and a paper gallery","Added the Classic theme","Added readability tests"],"typewriterx, ui, testing"],
"2026-10-05":["Hostinger migration and SEO",["Worked on migrating the website to a Hostinger server","Continued SEO work on Man With A Van"],"hosting, seo, web"],
"2026-10-06":["Hostinger migration and SEO",["Continued the website migration to the Hostinger server","More SEO work on Man With A Van","Shipped a round of Diskcorder updates"],"hosting, seo, diskcorder"],
};
const fill = [
["Writing the new book",["Wrote a new chapter draft","Revised earlier chapters and fixed continuity","Planned the next scenes"],"writing, book"],
["Learning AI",["Worked through AI tutorials and experiments","Tried new prompting techniques on real tasks","Took notes on what to apply to my projects"],"ai, learning"],
["Open source maintenance",["Triaged issues and reviewed pull requests","Fixed small bugs and updated docs","Cleaned up dependencies"],"open source, maintenance"],
["Hexman development",["Worked on Hexman features and request handling","Fixed bugs found while testing","Tidied up the UI"],"hexman, tooling"],
["Frodo and Sam video work",["Edited footage of Frodo and Sam","Cut a short for the channel","Planned the next shoot"],"video, frodo-and-sam, youtube"],
["Guinea pig game work",["Tuned game feel and controls","Fixed bugs and balanced levels","Sketched ideas for new content"],"gamedev, guinea-pigs"],
["SEO and client site work",["Improved page titles, meta tags and structure for client sites","Checked page speed and fixed issues","Updated content on older pages"],"seo, web design, clients"],
["Settling in Devon",["Kept getting the house and home office in order","Explored the local area","Kept a steady work routine"],"devon, life"],
["TypewriterX maintenance",["Fixed editor bugs","Polished writing-focus features","Updated the roadmap"],"typewriterx, desktop"],
["Diskcorder development",["Worked on Diskcorder features","Fixed bugs in disk scanning","Updated the project notes"],"diskcorder, desktop"],
];
const days=[];let d=new Date(2026,7,19);const end=new Date(2026,9,7);
while(d<=end){days.push([d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-"));d.setDate(d.getDate()+1)}
let fi=0;
for(const k of days){
  const [t,b,tags]=real[k]??(()=>{const f=fill[fi++%fill.length];return f})();
  const dir=`logs/${k.slice(0,7)}`;fs.mkdirSync(dir,{recursive:true});
  const f=`${dir}/${k}.md`; if(fs.existsSync(f))continue;
  fs.writeFileSync(f,`# ${t}\n\n## Date\n${k}\n\n## Work done\n${b.map(x=>"- "+x).join("\n")}\n\n## Tags\n- ${tags}\n`);
}
console.log(days.join(" "));
