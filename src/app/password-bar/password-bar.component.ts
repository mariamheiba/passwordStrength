import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-password-bar',
  templateUrl: './password-bar.component.html',
  styleUrls: ['./password-bar.component.scss']
})
export class PasswordBarComponent implements OnChanges {

  @Input() password: string;
  private colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];  // bar colors
  bar0: string;  
  bar1: string; 
  bar2: string;  
  bar3: string;  
  bar4: string;  
  private static measurePassScore(pass: string)
  {
    let score =0;
    let n = pass.length; //total length of pass
    let len = 0; // number of uppercase letters
    let num= 0; //number of digits
    let sc = 0; // number of special char 
    let ucr =0 ; //number of repeat occur of  consecutive capital letter
    let lcr = 0;//number of repeat occur of lower-case letter
    let nr =0 // number of repeat occur of digits
    let sl = 0; //seq letters
    let sn = 0; //seq numbers
    let ss = 0; //seq symbols
    let cap =false ; // flag if char is capital
    let lower = false;// flag if char is lower-case
    let sym =false ;//flag if char is a symbol
    let digit=false;//flag if char is a digit
    
    for(let i=0 ;i<n ;i++)
    {

      //next 4 variables are flags to check wheather char is cap or small or a number or a symbol
      cap = /[A-Z]+/.test(pass[i]);
      lower =/[a-z]+/.test(pass[i]);
      digit = /\d/.test(pass[i]);
      sym = /\W/.test(pass[i]);

      if(cap == true)
        len++;
      else if(digit ==true)
        num++;
      else if(sym == true)
        sc++;
      //check for repeat occurance of consecutive lower or upper letters or numbers
      if(i>0)
      {
        if(cap && /[A-Z]+/.test(pass[i-1]))
          ucr++;
        else if(lower && /[a-z]+/.test(pass[i-1]))
          lcr++;
        else if(digit && /\d/.test(pass[i-1]))
        {
          nr++;
        }
      }
      // check for seq letter , numbers , symbols
      if( i >1)
      {
        if(sym &&  /\W/.test(pass[i-1]) &&  /\W/.test(pass[i-2]))
          ss++;
  
        else if(digit && /\d/.test(pass[i-1]) && /\d/.test(pass[i-2]))
          {
            
            if((Math.abs(parseInt(pass[i])- parseInt(pass[i-1]))==1)&& (Math.abs(parseInt(pass[i-1])- parseInt(pass[i-2]))==1) )
              sn++;
          }
        else if((cap || lower)&& /[a-zA-Z]+/.test(pass[i-1])&& /[a-zA-Z]+/.test(pass[i-2]))
        {
          if(String.fromCharCode(pass.charCodeAt(i-2)+1) == pass[i-1])
          {
            if(String.fromCharCode(pass.charCodeAt(i-1)+1) == pass[i])
              sl++;
          }
        }
        
      }
    }

    score+= (n*4);
    score = Math.abs(score+((len-n)*2));
    score =  Math.abs(score+((len-n)*2));
    score+= (num*4);
    score+= (sc*6);
    let minReq = false;
    let reqs=0; //number of requirments done out of the 4 reqs
    // check wheather the min reqs are statisfied
    if(n>7 )
    {
      if(len>0)
        reqs++;
      if(n-len >0)
        reqs++;
      if(num >0)
        reqs++;
      if(sc > 0)
        reqs++;
      if(reqs>2)
        minReq=true;
    }

    
    if(num==0 && sc==0)
      score-= n;
    if(n== num)
      score-=n;
    score-=(ucr*2);
    score-=(lcr*2);
    score-=(nr*2);
    score-=(sl*3);
    score-=(sn*3);
    score-=(ss*3);
    //if it follows min reqs
    if(minReq)
      score+= (n*2);
    else
      score = 0;

    console.log(score);
    return score;
  }

  //to spicify the range of the score in the bars
  private getRange(score: number){
    let range= 0;
    if(score>80)
    {
      range=4;
    }
    else if(score>=60)
      range=3;
    else if(score>=40)
      range=2;
    else if(score>=20)
      range =1;
    return {
      range: range+1,
      col: this.colors[range]
    };
  }
  private setColors(num, col)
  {
    for(let i=0;i<num;i++)
      this['bar'+i]=col;
  }
  // to change the color of the bar based on strength
  ngOnChanges(changes:{[propName:string]:SimpleChange}):void {
    var pass = changes['password'].currentValue;
    this.setColors(5,'#DDD')
    if(pass){
      let r= this.getRange(PasswordBarComponent.measurePassScore(pass));
      this.setColors(r.range,r.col);
    }
  }
 



}

