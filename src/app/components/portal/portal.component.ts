import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css'],
})
export class PortalComponent implements OnInit {
  allQuestions: any[] = [];
  currentQuestion: number = 0;
  selectedAns: any[] = [];
  testId: any;
  testName: string = '';
  isFinished: boolean = false;
  finishedObj = {
    correct: 0,
    wrong: 0,
    total: 0,
    isFinished: this.isFinished,
  };
  timeInterval!: Subscription;
  timer: number = 60;
  constructor(private _api: ApiService, private _activeRoute: ActivatedRoute) {
    this.createTimer();
  }

  createTimer() {
    this.timeInterval = interval(1000).subscribe({
      next: (data) => {
        console.log(data);
        this.timer--;
      },
    });
    setTimeout(() => {
      this.timeInterval.unsubscribe();
      this.next();
    }, 60000);
  }

  ngOnInit(): void {
    console.log('timer is', this.timer);
    setTimeout(() => {
      this.finish();
    }, 1000 * 60 * 10);
    // let timeIntervale = setInterval(this.createTimer, 1000);
    // setTimeout(() => {
    //   clearInterval(timeIntervale);
    //   this.next();
    // }, 1000 * 60);
    let a = JSON.parse(localStorage.getItem('result') || '{}');
    if (a.isFinished) {
      this.isFinished = true;
      this.finishedObj.correct = a.correct;
      this.finishedObj.wrong = a.wrong;
      this.finishedObj.total = a.total;
    }
    this._activeRoute.queryParamMap.subscribe({
      next: (data) => {
        console.log(data.get('id'));
        this.testId = data.get('id');
        localStorage.setItem('_id', this.testId);
      },
    });
    if (this.testId === null) {
      this.testId = localStorage.getItem('_id');
    }
    let localQ = JSON.parse(localStorage.getItem('questions') || '[]');
    if (localQ.length != 0) {
      this.allQuestions = localQ;
      this.testName = JSON.parse(localStorage.getItem('testName') || '');
    } else {
      this.getQuestions();
    }
    this.currentQuestion = 0;
  }

  getQuestions() {
    this._api.getData().subscribe({
      next: (data: any) => {
        console.log('data is', data);
        data = data.tests.filter((ele: any) => {
          return ele._id === this.testId ? ele : '';
        });
        this.testName = data[0].name;
        localStorage.setItem('testName', JSON.stringify(this.testName));
        console.log('data after filter', data);
        this.allQuestions = data[0].questions;
        console.log(this.allQuestions);
        this.allQuestions = this.allQuestions.map((ele) => {
          return ele.type
            ? { ...ele, selectedAns: [] }
            : { ...ele, selectedAns: '' };
        });
        console.log('after map', this.allQuestions);
      },
    });
  }
  ansSelected(checkAns: any, index: any) {
    if (this.allQuestions[this.currentQuestion].type) {
      if (this.allQuestions[this.currentQuestion].selectedAns.includes(index)) {
        this.allQuestions[this.currentQuestion].selectedAns = this.allQuestions[
          this.currentQuestion
        ].selectedAns.filter((ele: any) => {
          return ele != index;
        });
      } else {
        let a = this.allQuestions[this.currentQuestion].selectedAns.push(index);
      }
    } else {
      this.allQuestions[this.currentQuestion].selectedAns = index;
    }

    localStorage.setItem('questions', JSON.stringify(this.allQuestions));
  }
  next() {
    console.log(this.currentQuestion);
    if (this.currentQuestion + 1 < this.allQuestions.length) {
      this.currentQuestion++;
      this.timer = 60;
      this.timeInterval.unsubscribe();
      this.createTimer();
    } else {
      this.timeInterval.unsubscribe();
      alert('This is last question');
    }
  }
  previous() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    } else {
      alert('This is first question');
    }
  }
  finish() {
    let correctAns = 0;
    let wrongAns = 0;
    let totalQuestion = this.allQuestions.length;
    for (let items of this.allQuestions) {
      if (items.type) {
        let a = items.correctOptionIndex.every((ele: any) => {
          return items.selectedAns.includes(ele);
        });
        let b = items.selectedAns.every((ele: any) => {
          return items.correctOptionIndex.includes(ele);
        });
        console.log('a is', a, 'b is', b);
        if (a && b) {
          correctAns++;
        } else {
          wrongAns++;
        }
      } else {
        if (items.correctOptionIndex === items.selectedAns) {
          correctAns++;
        } else {
          wrongAns++;
        }
      }
    }
    this.isFinished = true;

    let obj = {
      correct: correctAns,
      wrong: wrongAns,
      total: totalQuestion,
      isFinished: this.isFinished,
    };
    this.finishedObj = obj;
    localStorage.setItem('result', JSON.stringify(obj));
    localStorage.removeItem('testName');
    localStorage.removeItem('questions');
  }
  newTest() {
    localStorage.removeItem('result');
    localStorage.removeItem('testName');
    localStorage.removeItem('_id');
  }
}
