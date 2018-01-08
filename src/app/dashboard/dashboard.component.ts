import {Component, OnInit} from '@angular/core';
import {addPropertyService} from '../services/addProperty.service';
import {PropertiesService} from "../services/properties.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [PropertiesService]
})
export class DashboardComponent implements OnInit {

    rows = [];

    // Shared chart options
    globalChartOptions: any = {
        responsive: true,
        legend: {
            display: false,
            position: 'bottom'
        }
    };

    // Bar
    barChartLabels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
    barChartType = 'bar';
    barChartLegend = true;
    barChartData: any[] = [{
        data: [6, 5, 8, 8, 5, 5, 4],
        label: 'Series A',
        borderWidth: 0
    }, {
        data: [5, 4, 4, 2, 6, 2, 5],
        label: 'Series B',
        borderWidth: 0
    }];
    barChartOptions: any = Object.assign({
        scaleShowVerticalLines: false,
        tooltips: {
            mode: 'index',
            intersect: false
        },
        responsive: true,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    defaultFontColor: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                stacked: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    defaultFontColor: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                stacked: true
            }]
        }
    }, this.globalChartOptions);

    // Bubble Chart
    bubbleChartData: Array<any> = [{
        data: [{
            x: 6,
            y: 5,
            r: 15,
        }, {
            x: 5,
            y: 4,
            r: 10,
        }, {
            x: 8,
            y: 4,
            r: 6,
        }, {
            x: 8,
            y: 4,
            r: 6,
        }, {
            x: 5,
            y: 14,
            r: 14,
        }, {
            x: 5,
            y: 6,
            r: 8,
        }, {
            x: 4,
            y: 2,
            r: 10,
        }],
        label: 'Series A',
        borderWidth: 1
    }];
    bubbleChartType = 'bubble';

    // newsfeed
    messages: Object[] = [{
        from: 'Ali Connors',
        message: 'I will be in your neighborhood',
        photo: 'assets/images/face3.jpg',
        subject: 'Brunch this weekend?',
    }, {
        from: 'Trevor Hansen',
        message: 'Wish I could but we have plans',
        photo: 'assets/images/face6.jpg',
        subject: 'Brunch this weekend?',
    }, {
        from: 'Sandra Adams',
        message: 'Do you have Paris recommendations instead?',
        photo: 'assets/images/face4.jpg',
        subject: 'Brunch this weekend?',
    },];

    // Horizontal Bar Chart
    barChartHorizontalType = 'horizontalBar';
    barChartHorizontalOptions: any = Object.assign({
        scaleShowVerticalLines: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 9
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                }
            }]
        }
    }, this.globalChartOptions);

    // Bar Chart Stacked
    barChartStackedOptions: any = Object.assign({
        scaleShowVerticalLines: false,
        tooltips: {
            mode: 'index',
            intersect: false
        },
        responsive: true,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                stacked: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                stacked: true
            }]
        }
    }, this.globalChartOptions);

    // Line Chart
    lineChartData: Array<any> = [{
        data: [6, 5, 8, 8, 5, 5, 4],
        label: 'Series A',
        borderWidth: 1
    }, {
        data: [5, 4, 4, 2, 6, 2, 5],
        label: 'Series B',
        borderWidth: 1
    }];
    lineChartLabels: Array<any> = ['1', '2', '3', '4', '5', '6', '7'];
    lineChartOptions: any = Object.assign({
        animation: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 9,
                }
            }]
        }
    }, this.globalChartOptions);
    lineChartColors: Array<any> = [{ // grey
        backgroundColor: '#7986cb',
        borderColor: '#3f51b5',
        pointBackgroundColor: '#3f51b5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }, { // dark grey
        backgroundColor: '#eeeeee',
        borderColor: '#e0e0e0',
        pointBackgroundColor: '#e0e0e0',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
    }, { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];
    lineChartLegend = true;
    lineChartType = 'line';
    lineChartSteppedData: Array<any> = [{
        data: [6, 5, 8, 8, 5, 5, 4],
        label: 'Series A',
        borderWidth: 1,
        fill: false,
        steppedLine: true
    }, {
        data: [5, 4, 4, 2, 6, 2, 5],
        label: 'Series B',
        borderWidth: 1,
        fill: false,
        steppedLine: true
    }];
    lineChartPointsData: Array<any> = [{
        data: [6, 5, 8, 8, 5, 5, 4],
        label: 'Series A',
        borderWidth: 1,
        fill: false,
        pointRadius: 10,
        pointHoverRadius: 15,
        showLine: false
    }, {
        data: [5, 4, 4, 2, 6, 2, 5],
        label: 'Series B',
        borderWidth: 1,
        fill: false,
        pointRadius: 10,
        pointHoverRadius: 15,
        showLine: false
    }];
    lineChartPointsOptions: any = Object.assign({
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 9,
                }
            }]
        },
        elements: {
            point: {
                pointStyle: 'rectRot',
            }
        }
    }, this.globalChartOptions);


    ComboChartLabels: Array<any> = ['1', '2', '3', '4', '5', '6', '7'];

    // Pie
    pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
    pieChartData: number[] = [300, 500, 100];
    pieChartType = 'pie';

    pieChartColors: any[] = [{
        backgroundColor: ['#f44336', '#3f51b5', '#ffeb3b', '#4caf50', '#2196f']
    }];

    pieOptions: any = {
        responsive: true,
        legend: {
            position: 'right'
        }
    };

    // PolarArea
    polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
    polarAreaChartData: any = [300, 500, 100, 40, 120];
    polarAreaLegend = true;
    polarAreaChartType = 'polarArea';

    // Radar
    radarChartLabels: string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
    radarChartData: any = [{
        data: [65, 59, 90, 81, 56, 55, 40],
        label: 'Series A'
    }, {
        data: [28, 48, 40, 19, 96, 27, 100],
        label: 'Series B'
    }];
    radarChartType = 'radar';

    // combo chart
    comboChartLabels: Array<any>;
    chartColors: Array<any> = [{ // grey
        backgroundColor: '#7986cb',
        borderColor: '#03A9F4',
        pointBackgroundColor: '#03A9F4',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }, { // dark grey
        backgroundColor: '#eeeeee',
        borderColor: '#e0e0e0',
        pointBackgroundColor: '#e0e0e0',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
    }, { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];
    comboChartLegend = true;
    ComboChartData: Array<any> = [{
        data: [],
        label: 'Tendencia',
        borderWidth: 1,
        type: 'line',
        fill: false
    }, {
        data: [],
        label: 'Ingresadas',
        borderWidth: 1,
        type: 'bar',
    }];
    ComboChartOptions: any = Object.assign({
        animation: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgba(0,0,0,0.02)',
                    zeroLineColor: 'rgba(0,0,0,0.02)'
                },
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 9,
                }
            }]
        }
    }, this.globalChartOptions);

    // Doughnut
    doughnutChartColors: any[] = [{
        backgroundColor: ['#03A9F4', '#009688', '#9C27B0', '#E81E63', '#FEC007', '#3F51B5', '#795548', '#F34336', '#FE5722', '#607D8A', '#00BBD3', '#4CAE50']
    }];

    doughnutChartLabels: string[] = [];
    /*doughnutChartLabels: string[] = ['Casas', 'Lotes', 'Fincas', 'Apartamentos', 'Locales', 'Fincas en parcelación', 'Oficinas', 'Lotes industriales', 'Lotes en parcelación', 'Bodegas', 'Negocios', 'Edificios'];*/
    doughnutChartData: number[] = [];
    doughnutChartType = 'doughnut';
    doughnutOptions: any = {
        responsive: true,
        legend: false
    };

    consultantsNumber: number;
    locationsNumber: number;
    ownersNumber: number;
    propertiesNumber: number;

    months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    showDoughnutChart = false;
    showComboChart = false;

    constructor(private _addPropertyService: addPropertyService,
                private _propertiesService: PropertiesService) {
        this.fetch((data) => {
            this.rows = data;
        });
        this._addPropertyService.buttonValue(false);
    }

    ngOnInit() {

        this._propertiesService.numericalStatistics()
            .subscribe(
                res => {
                    this.consultantsNumber = res.consultantsNumber;
                    this.locationsNumber = res.locationsNumber;
                    this.ownersNumber = res.ownersNumber;
                    this.propertiesNumber = res.propertiesNumber;
                },
                error => console.log(error)
            );

        this._propertiesService.numberForMonth()
            .subscribe(
                res => {
                    if (res[0] != null) {
                        this.showDoughnutChart = true;
                        let i;
                        let length = res.length;
                        if (length == 13) {
                            res.splice(0, 1);
                            length = length - 1;
                            console.log(res);
                        }
                        let actualMonth = res[length - 1].month;
                        let fromMonth;
                        if (actualMonth == 12) {
                            fromMonth = 1;
                        } else {
                            fromMonth = actualMonth + 1;
                        }
                        let actualYear = res[length - 1].year;
                        actualYear = actualYear.toString().substr(-2);
                        let previousYear;
                        let chartLabels: Array<any> = [];
                        let data1: Array<number> = [];
                        let data0: Array<number> = [];
                        if (actualMonth != 12) {
                            previousYear = actualYear - 1;
                        } else {
                            previousYear = actualYear;
                        }
                        for (i = 0; i < 12; i++) {
                            chartLabels.push(this.months[fromMonth - 1] + ' ' + previousYear);
                            let found = false;
                            let numberFound;
                            for (var j = 0; j < res.length; j++) {
                                if (res[j] && res[j].month === fromMonth) {
                                    /*                                  console.log(res[j].month);
                                     console.log(res[j].properties_number);*/
                                    found = true;
                                    numberFound = j;
                                    break;
                                }
                            }
                            if (found) {
                                data1.push(res[numberFound].properties_number);
                                data0.push(res[numberFound].properties_number + 0.5);
                            } else {
                                data1.push(0);
                                data0.push(0);
                            }
                            if (fromMonth == 12) {
                                fromMonth = 0;
                                previousYear = actualYear;
                            }
                            fromMonth = fromMonth + 1;
                        }
                        this.ComboChartData[1].data = data1;
                        this.ComboChartData[0].data = data0;
                        this.comboChartLabels = chartLabels;
                    }
                },
                error => console.log(error)
            );

        this._propertiesService.numberForPropertyType()
            .subscribe(
                res => {
                    if (res[0] != null) {
                        this.showComboChart = true;
                        let labels = [];
                        let data = [];
                        Object.keys(res).forEach(key => {
                            this.doughnutChartLabels.push(res[key].property_type);
                            /*labels.push(res[key].property_type);*/
                            /*console.log(res[key].property_type);*/
                            data.push(res[key].properties_number);
                        });
                        /*this.doughnutChartLabels = labels;*/
                        this.doughnutChartData = data;
                    }
                },
                error => console.log(error)
            );


        //   this.comboChartLabels = ['Sep 16', 'Oct 16', 'Nov 16', 'Dic 16', 'Ene 17', 'Feb 17', 'Mar 17', 'Abr 17', 'May 17', 'Jun 17', 'Jul 17', 'Ago 17'];
    }

    // project table
    fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', `assets/data/projects.json`);
        req.onload = () => {
            cb(JSON.parse(req.response));
        };
        req.send();
    }
}