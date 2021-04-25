const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

request('https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results', callback);

let finalData = [];

function callback(error, response, html){
    fs.writeFileSync('matchDetails.html', html);
    let $ = cheerio.load(html);
    let scoreCard = $('a[data-hover="Scorecard"]');
    
    for(let i = 0; i < 6; i++){
        finalData.push({});
        let scoreCardlink = ("https://www.espncricinfo.com"+ $(scoreCard[i]).attr('href'));
        request(scoreCardlink, callback2.bind(this, i));
        
    }
                            
    
    

}



function callback2(idx, error, response, html){
    if(!error){
        fs.writeFileSync("cricInfoIpl.html", html);
        let $ = cheerio.load(html);
        let teams = $('.event .name');
        let team1 = $(teams[0]).text();
        let team2 = $(teams[1]).text();
        finalData[idx][team1] = {'Batting' : {'Players' : []}, 'Bowling' : {'Players' : []}};
        finalData[idx][team2] = {'Batting' : {'Players' : []}, 'Bowling' : {'Players' : []}};

        let table = $('.table.batsman');
        for(let i = 0; i < table.length; i++){
            let tr = $(table[i]).find('tbody tr');
            let keyarray = ["Player","", "Run", "Ball","", "4's", "6's", "StrikeRate"];
            
            for(let j = 0; j < tr.length - 1; j += 2){
                
                    let td = $(tr[j]).find('td');
                    let playerInfo = {};
                    
                    for(let k = 0; k < td.length; k++){
                        if(k != 1 && k != 4){
                            playerInfo[keyarray[k]] = $(td[k]).text();
                        }
                    }
                    if(i == 0){
                        finalData[idx][team1]['Batting']['Players'].push(playerInfo);
                    }else if(i == 1){
                        finalData[idx][team2]['Batting']['Players'].push(playerInfo);
                    }
                    
                   

                
                
                
            }
            
        }
        


        let tablebowler = $('.table.bowler');
        for(let i = 0; i < tablebowler.length; i++){
            let tr = $(tablebowler[i]).find('tbody tr');
            let keyarrays = ["Player","Over", "Maiden", "Run","Wicket", "ECON", "","","", "Wide", "NoBall"];
            
            for(let j = 0; j < tr.length; j++){
                
                    let td = $(tr[j]).find('td');
                    let bowlerInfo = {};
                    
                    for(let k = 0; k < td.length; k++){
                        if(k != 6 && k != 7 && k != 8){
                            bowlerInfo[keyarrays[k]] = $(td[k]).text();
                        }
                    }
                    if(i == 0){
                        finalData[idx][team1]['Bowling']['Players'].push(bowlerInfo);
                    }else if(i == 1){
                        finalData[idx][team2]['Bowling']['Players'].push(bowlerInfo);
                    }
                    
                   

                
                
                
            }
            
        }
        fs.writeFileSync('finalData.json', JSON.stringify(finalData));
        
    
    }
}