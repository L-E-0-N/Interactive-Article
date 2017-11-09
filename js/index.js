/* =============== VARIABLES =============== */

//Create a var with the width / height attribute value of the svg
var width = document.querySelector(".bubbleChart").getAttribute("width"),
    height = document.querySelector(".bubbleChart").getAttribute("height");

//Define the svg in a var and put a <g> element inside the svg
var svgBubbleChart = d3.select(".bubbleChart")
    .append("g")
    .attr("class", "bubbleContainer")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); //Place the <g> element in the middle

//Define the svg for the connection lines and do the same
var svgBubbleChartLine = d3.select(".bubbleChartLine")
    .append("g")
    .attr("class", "lineContainer")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); //Place the <g> element in the middle

var circleSize = d3.scaleSqrt().domain([0, 5.5]).range([2, 20]); //Scales the numbers 0 / 5.5 to 1 / 10 and everything in between.
var yearsTogether = d3.forceY(width / 2).strength(0.05); //Place the X force inside a variable, this force places everything to the horizontal middle
var tooltipGrouped = d3.select(".tooltipContainer").append("div").attr("class", "tooltipGrouped"); //Defining the tooltip
var bullyBully = new Audio('files/bully.mp3'); //Creating a var which holds the location of the .mp3
var sectionPlayed = 0; //Check which section of the page can run their functions when scrolling
var bubbleChartPlayed = 0; //Check if the bubble chart function can play
var dataset; //Create a variable to save the dataset
var RadialSize = 130; //Size of the radius of the bubble chart
var barChartGroupedCheck = 0; //Check which version of the barchart has played. According to this, other function will be triggered.

//Place the X force inside a variable, this force places every circle with a different year at on a different place
var yearsSplit = d3.forceY(function(d) {
    if (d.periode == 2012) {
        return -1000; //Place every circle from the year 2012 -1000px vertically from the center, etc..
    } else if (d.periode == 2013) {
        return -500;
    } else if (d.periode == 2014) {
        return 0;
    } else if (d.periode == 2015) {
        return 500;
    } else if (d.periode == 2016) {
        return 1000;
    }
}).strength(0.05);

var scatterPlot = d3.forceX(function(d) { //Create a scatterplot from the bubbles by creating multiple forces over the X axis. The range goes from 0.1% to 5.5%.
    var scatterSpread = d3.scaleSqrt().domain([0.1, 5.5]).range([-800, 800]); //Scale 0.1 to -800 and 5.5 to 800 and everything inbetween.
    return scatterSpread(d.percentage); //Return the outcome
}).strength(0.05);

//Create a var with the starting force
var simulation = d3.forceSimulation() //Save the force into a variable
    .force("r", d3.forceRadial(RadialSize)) //This force makes sure every circle is in a radius of approximately 100px
    .force("collide", d3.forceCollide(function(d) {
        return circleSize(d.percentage) + 0.5; //Ensures the circles don't go on top of each other, this force depends on the value and is different for each circle
    }));

/* =============== LOADING DATA =============== */

d3.tsv("data/data_totaal.tsv", function(error, data) { //Loads the data in

    dataset = data; //Store the data into another variable

    /* =============== JUST THE BARCHART =============== */

    //Set the proper magins
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    };
    var width = document.querySelector(".barChart").getAttribute("width") - margin.left - margin.right; //Get the width from the width attribute of the svg minus the margins
    var height = document.querySelector(".barChart").getAttribute("height") - margin.top - margin.bottom; //Get the height from the height attribute of the svg minus the margins

    //Set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    //Select the svg and add a <g> element to it positioned in the center
    var svgBarChart = d3.select(".barChart")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Load the data
    d3.tsv("data/data_bar_totaal.tsv", function(error, dataBarTotal) {
        if (error) throw error;

        //Scale the range of the data in the domains
        x.domain(dataBarTotal.map(function(d) {
            return d.periode;
        }));
        y.domain([2.8, 3.3]); //Custom domain for this particular dataset (from 0 to 3.3 is too much)

        //Create the bars for the barchart
        svgBarChart.selectAll(".bar")
            .data(dataBarTotal)
            .enter().append("g")
            .attr("class", "barContainer")
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return x(d.periode);
            })
            .attr("width", x.bandwidth())
            .attr("y", function(d) {
                return y(d.percentage);
            })
            .attr("height", function(d) {
                return height - y(d.percentage);
            })
            .style("fill", function(d) { //Give each bar their own color
                if (d.periode == 2012) {
                    return "#0b6ad9";
                } else if (d.periode == 2013) {
                    return "#0861CA";
                } else if (d.periode == 2014) {
                    return "#0c5ab6";
                } else if (d.periode == 2015) {
                    return "#11509a";
                } else if (d.periode == 2016) {
                    return "#0A4890";
                }
            });

        //Make two variables with will increment each time a new text values gets created
        var indexBarX = 1;
        var indexBarY = 1;

        svgBarChart.selectAll(".barContainer")
            .append("text")
            .attr("class", "value")
            .attr("y", function(d) {
                var valueYPosition = Number(document.querySelector(".barChart .barContainer:nth-of-type(" + indexBarY + ") .bar").getAttribute("y")) + 30; //Get the y value of each bar and add 30 to it (so it's placed inside the bar)
                indexBarY++; //Increment the variable
                return valueYPosition; //Return the correct Y possition for the text value
            })
            .attr("x", function(d) {
                var valueXPosition = Number(document.querySelector(".barChart .barContainer:nth-of-type(" + indexBarX + ") .bar").getAttribute("x")) + 48; //Get the x value of each bar and add 48 to it (so it's places centered of the bar)
                indexBarX++; //Increment the variable
                return valueXPosition; //Return the correct X possition for the text value
            })
            .attr("text-anchor", "middle") //Center allign the text
            .text(function(d) {
                return (d.percentage + "%");
            });

        //Create an X axis
        svgBarChart.append("g")
            .attr("class", "axisX")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        /* =============== INITIAL STUFF =============== */

        insertCircles(); //Create all the circles for the bubblechart

        //Add a diabled class for the buttons
        document.querySelector(".total").classList.add("disabledSection");
        document.querySelector(".age").classList.add("disabledSection");
        document.querySelector(".sex").classList.add("disabledSection");

        //Remove the click trigger from the buttons
        d3.select(".total").on("click", null);
        d3.select(".age").on("click", null);
        d3.select(".sex").on("click", null);

        //Run a simulation on every circle (node)
        simulation.nodes(data)
            .on('tick', movingIn) //Run movingIn on every "tick" of the clock
            .alphaTarget(0.5)
            .restart();

        /* =============== JUST THE MAP =============== */

        //Create a var with the width / height attribute value of the svg
        var widthMap = document.querySelector(".map").getAttribute("width"),
            heightMap = document.querySelector(".map").getAttribute("height");

        //Define the svg in a var and put a <g> element inside the svg
        var svgMap = d3.select(".map")
            .append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "scale(1.3) translate(" + -150 + "," + -10 + ")"); //Place the <g> element in the middle by offsetting it

        var tooltipMap = d3.select(".tooltipMapContainer").append("div").attr("class", "tooltipMap"); //Defining the tooltip

        var projection = d3.geoMercator() //Define a variable with the projection
            .scale(1)
            .translate([0, 0]);

        var path = d3.geoPath()
            .projection(projection);

        var color = d3.scaleLinear() //Define a color variable which will calculate the correct color by each number. Even if it is a number inbetween the onces noted.
            .domain([2.2, 2.6, 3.0, 3.4, 3.8, 4.2]) //Each step is a color from .range([])
            .interpolate(d3.interpolateRgb)
            .range(["#0b6ad9", "#0861CA", "#0c5ab6", "#11509a", "#0A4890"]); //The colors

        d3.json("data/nld.json", function(error, nld) { //Load the svg paths data
            d3.tsv("data/data_provincie.tsv", function(error, dataMap) { //Load the data which will be shown

                // No idea whats happening here
                var l = topojson.feature(nld, nld.objects.subunits).features[3],
                    b = path.bounds(l),
                    s = 0.2 / Math.max((b[1][0] - b[0][0]) / widthMap, (b[1][1] - b[0][1]) / heightMap),
                    t = [(widthMap - s * (b[1][0] + b[0][0])) / 2, (heightMap - s * (b[1][1] + b[0][1])) / 2];

                projection
                    .scale(s)
                    .translate(t);

                svgMap.selectAll("path") //Create the map with all the data for the svg paths
                    .data(topojson.feature(nld, nld.objects.subunits).features).enter()
                    .append("path")
                    .attr("d", path)
                    .attr("fill", function(d) {
                        //Loop through each datapoint in the dataset and check it against the properties.name of the svg path
                        for (var i = 0; i < dataMap.length; i++) {
                            if (dataMap[i].periode == "2012" && dataMap[i].regio == d.properties.name) { //Checks if the year and province name are the same as the svg
                                return color(dataMap[i].percentage); //Return the correct color
                            }
                        }
                    })
                    .attr("stroke", function(d) {
                        //Loop through each datapoint in the dataset and check it against the properties.name of the svg path
                        for (var i = 0; i < dataMap.length; i++) {
                            if (dataMap[i].periode == "2012" && dataMap[i].regio == d.properties.name) { //Checks if the year and province name are the same as the svg
                                return color(dataMap[i].percentage); //Return the correct color
                            }
                        }
                    })
                    .attr("stroke-linejoin", "round") //Make the corners round
                    .attr("stroke-linecap", "round") //Make the ends / begins round
                    .attr("stroke-width", "0.5") //Make a small stroke so you can't see through the map (there were some background pixels visible)
                    .attr("class", function(d, i) {
                        return d.properties.name; //Give the path the same class as the name defined in the json dataset
                    })
                    //Remove the places not from the Netherlands from the map
                    .attr("display", function(d) {
                        if (d.properties.name == undefined || d.properties.name == "Saba" || d.properties.name == "St. Eustatius" || d.properties.name == "Bonaire") {
                            return "none";
                        }
                    })
                    .on("mousemove", function(d) { //Displays the circles data into a tooltip
                        for (var i = 0; i < dataMap.length; i++) {
                            if (dataMap[i].periode == "2012" && dataMap[i].regio == d.properties.name) { //Checks if the year and province name are the same as the svg
                                tooltipMap
                                    .style("top", d3.event.pageY - window.pageYOffset + "px") //Because this section is fixed I can't just use the y value but have to subtract the pixels that already have been scrolled.
                                    .style("left", d3.event.pageX - window.innerWidth / 2 + "px") //Same goes for this one
                                    .style("display", "inline-block")
                                    .html("<span class='tooltipGroupedPercentage'>" + (dataMap[i].percentage) + "</span>%<br><span class='tooltipLabel'>Provincie:</span> <span class='tooltipAnswer'>" + (d.properties.name) + "</span>");

								//Legenda indicator
								var gradientIndicatorPosition = d3.scaleLinear().domain([2.2, 4.2]).range([1.5, 98.5]); //Make a scale sp 2.2 equals 1.5 and 4.2 equals 98.5

								d3.select(".gradientIndicator")
									.style("opacity", "1")
									.style("left", gradientIndicatorPosition(dataMap[i].percentage) + "%"); //Update the indicator postion to represent the percentage on the legenda
                            }
                        }

                    })
                    .on("mouseout", function(d) { //Hide the tooltip on mouseout
                        tooltipMap
                            .style("display", "none");

						//Legenda indicator
						d3.select(".gradientIndicator")
							.style("opacity", "0");
                    });

                //Add event triggers to the buttons
                d3.select(".year2012").on("click", null);
                d3.select(".year2013").on("click", showYearMap);
                d3.select(".year2014").on("click", showYearMap);
                d3.select(".year2015").on("click", showYearMap);
                d3.select(".year2016").on("click", showYearMap);
                document.querySelector(".year2012").classList.add("disabled"); //Add a class to the 2012 year button

                function showYearMap() {
                    var activeYear = this.className.slice(4, 8); //Get the year of the pressed button
                    document.querySelector(".mapDescription h2").innerHTML = "Slachtoffers van cyberpesten in " + activeYear; //Change the description to include the active year

                    svgMap.selectAll("path")
                        .attr("fill", function(d) {
                            for (var i = 0; i < dataMap.length; i++) {
                                if (dataMap[i].periode == activeYear && dataMap[i].regio == d.properties.name) { //Checks if the year and province name are the same as the svg
                                    return color(dataMap[i].percentage);
                                }
                            }
                        })
                        .attr("stroke", function(d) {
                            for (var i = 0; i < dataMap.length; i++) {
                                if (dataMap[i].periode == activeYear && dataMap[i].regio == d.properties.name) { //Checks if the year and province name are the same as the svg
                                    return color(dataMap[i].percentage);
                                }
                            }
                        })
                        .on("mousemove", function(d) { //Displays the circles data into a tooltip
                            for (var i = 0; i < dataMap.length; i++) {
                                if (dataMap[i].periode == activeYear && dataMap[i].regio == d.properties.name) { //Checks if the year and province name are the same as the svg
                                    tooltipMap
                                        .style("top", d3.event.pageY - window.pageYOffset + "px")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("display", "inline-block")
                                        .html("<span class='tooltipGroupedPercentage'>" + (dataMap[i].percentage) + "</span>%<br><span class='tooltipLabel'>Provincie:</span> <span class='tooltipAnswer'>" + (d.properties.name) + "</span>");

									//Legenda indicator
									var gradientIndicatorPosition = d3.scaleLinear().domain([2.2, 4.2]).range([1.5, 98.5]); //Make a scale sp 2.2 equals 1.5 and 4.2 equals 98.5

									d3.select(".gradientIndicator")
										.style("opacity", "1")
										.style("left", gradientIndicatorPosition(dataMap[i].percentage) + "%"); //Update the indicator postion to represent the percentage on the legenda
                                }
                            }
                        })
                        .on("mouseout", function(d) { //Hide the tooltip on mouseout
                            tooltipMap
                                .style("display", "none");

							//Legenda indicator
							d3.select(".gradientIndicator")
								.style("opacity", "0");
                        });

                    //Remove the disabled class from all the buttons
                    document.querySelector(".year2012").classList.remove("disabled");
                    document.querySelector(".year2013").classList.remove("disabled");
                    document.querySelector(".year2014").classList.remove("disabled");
                    document.querySelector(".year2015").classList.remove("disabled");
                    document.querySelector(".year2016").classList.remove("disabled");

                    //Give each button a trigger
                    d3.select(".year2012").on("click", showYearMap);
                    d3.select(".year2013").on("click", showYearMap);
                    d3.select(".year2014").on("click", showYearMap);
                    d3.select(".year2015").on("click", showYearMap);
                    d3.select(".year2016").on("click", showYearMap);

                    this.classList.add("disabled"); //Add a disabled class to the pressed button
                    d3.select(".year" + activeYear).on("click", null); //Remove the trigger from the pressed button
                }
            });
        });

        /* =============== TRIGGERS =============== */

        document.querySelector('body').onscroll = scroll;
        d3.select(".total").on("click", showTotal);
        d3.select(".total").on("click", null);
        d3.select(".age").on("click", showAge);
        d3.select(".sex").on("click", showSex);
        d3.select(".audio").on("mouseover", audioPlay);
        d3.select(".audio").on("mouseout", audioStop);

        document.querySelector(".total").classList.add("disabled"); //Add the class disabled to the button

        /* =============== FUNCTIONS =============== */

        function insertCircles() {

            svgBubbleChartLine //Selects all the circles
                .append("polyline") //Add a circle for each data row
                .attr("class", "connectionLine"); //Add a class to each circle

            svgBubbleChart.selectAll(".bubble") //Selects all the circles
                .data(dataset) //Use the dataset
                .enter().append("circle") //Add a circle for each data row
                .attr("class", "bubble") //Add a class to each circle
                .attr("wie", function(d) {
                    return d.wie;
                }) //Add the kind to the circle
                .attr("soort", function(d) {
                    return d.wat;
                }) //Add the type to the circle
                .attr("r", function(d) { //Gives each circle a size based on the value of d.percentage
                    return circleSize(d.percentage);
                })
                .attr("fill", function(d) { //Gives each circle a different fill bases on the vale of d.wie
                    if (d.wie == "Mannen") {
                        return "#2bc4ed";
                    } else if (d.wie == "Vrouwen") {
                        return "#e8759f";
                    } else if (d.wie == "15 tot 18 jaar") {
                        return "#F9F8F8";
                    } else if (d.wie == "18 tot 25 jaar") {
                        return "#A3D9FF";
                    } else if (d.wie == "25 tot 45 jaar") {
                        return "#F3DE8A";
                    } else if (d.wie == "45 tot 65 jaar") {
                        return "#EB9486";
                    } else if (d.wie == "65+") {
                        return "#686294";
                    } else if (d.wat == "Laster") {
                        return "#FFFFFF";
                    } else if (d.wat == "Chantage") {
                        return "#b3c6d7";
                    } else if (d.wat == "Stalker") {
                        return "#406d94";
                    } else if (d.wat == "Bedreiging") {
                        return "#233d59";
                    } else if (d.wat == "Anders") {
                        return "#2C3138";
                    }
                })
                .on("mousemove", function(d) { //Displays the circles data into a tooltip

                    //If d.wie = Iedereen, don't show that part. Unfortunally I can't place a function with an if statement inside the .html thing so I had to copy the whole code.
                    if (d.wie == "Iedereen") {
                        tooltipGrouped
                            .style("top", "50%")
                            .style("left", "50%")
                            .style("opacity", "1")
                            .style("color", "#0a5ab9")
                            .style("transform", "translate(-50%, -50%)")
                            .style("background", "none")
                            .style("padding", "20px 0 0 0")
                            .style("box-shadow", "0 0 0 0 rgba(0, 0, 0, 0.2)")
                            .style("border-radius", "0")
                            .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Periode:</span> <span class='tooltipAnswer'>" + (d.periode) + "</span>");
                        d3.select(".tooltipGroupedPercentage")
                            .style("color", "#0a5ab9");
                        d3.select(".tooltipLabel")
                            .style("color", "#0a5ab9");
                    }
                    // If not, do show the person / group / age it's about
                    else {
                        tooltipGrouped
                            .style("top", "50%")
                            .style("left", "50%")
                            .style("opacity", "1")
                            .style("color", "#0a5ab9")
                            .style("transform", "translate(-50%, -50%)")
                            .style("background", "none")
                            .style("padding", "20px 0 0 0")
                            .style("box-shadow", "0 0 0 0 rgba(0, 0, 0, 0.2)")
                            .style("border-radius", "0")
                            .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Periode:</span> <span class='tooltipAnswer'>" + (d.periode) + "</span><br><span class='tooltipLabel'>Wie:</span> <span class='tooltipAnswer'>" + (d.wie) + "</span>");
                        d3.select(".tooltipGroupedPercentage")
                            .style("color", "#0a5ab9");
                        d3.select(".tooltipLabel")
                            .style("color", "#0a5ab9");
                    }
                })
                .on("mouseout", function(d) { //Hide the tooltip on mouseout
                    tooltipGrouped
                        .style("opacity", "0");
                });

            //Remove the tip when the user hovered over a circle
            d3.selectAll(".bubble").on("mouseover", function() {
				//Remove the tip when the user hovered over a circle
                d3.select(".chartContainer .hoverTip h3")
                    .style("display", "none");
            });
        }

        function scroll() {
            // console.log(window.pageYOffset);

            /* =============== CALCULATING THE SECTIONS =============== */

            //Calculating the center of the screen's position compared to the top
            var middleOfScreen = window.innerHeight / 2;
            //Getting the position of <body> to compare it with the indicator for a Y position
            var bodyPosition = document.body.getBoundingClientRect();
            //1st indicator Y position
            var indicatorOnePosition = document.querySelector(".indicatorOne").getBoundingClientRect();
            var indicatorOne = indicatorOnePosition.top - bodyPosition.top - middleOfScreen + 30;
            //2nd indicator Y position
            var indicatorTwoPosition = document.querySelector(".indicatorTwo").getBoundingClientRect();
            var indicatorTwo = indicatorTwoPosition.top - bodyPosition.top - middleOfScreen + 15;
            //3rd indicator Y position
            var indicatorThreePosition = document.querySelector(".indicatorThree").getBoundingClientRect();
            var indicatorThree = indicatorThreePosition.top - bodyPosition.top - middleOfScreen + 15;
            //4th indicator Y position
            var indicatorFourPosition = document.querySelector(".indicatorFour").getBoundingClientRect();
            var indicatorFour = indicatorFourPosition.top - bodyPosition.top - middleOfScreen + 15;
            //5th indicator Y position
            var indicatorFivePosition = document.querySelector(".indicatorFive").getBoundingClientRect();
            var indicatorFive = indicatorFivePosition.top - bodyPosition.top - middleOfScreen + 15;
            //6th indicator Y position
            var indicatorSixPosition = document.querySelector(".indicatorSix").getBoundingClientRect();
            var indicatorSix = indicatorSixPosition.top - bodyPosition.top - middleOfScreen + 15;
            //7th indicator Y position
            var indicatorSevenPosition = document.querySelector(".indicatorSeven").getBoundingClientRect();
            var indicatorSeven = indicatorSevenPosition.top - bodyPosition.top - middleOfScreen + 30;

            /* =============== SECTION 1 =============== */
            if (window.pageYOffset < indicatorOne) {

                if (sectionPlayed == 1) { //Check if this section is able to run

                    //Show these elements in this section
                    d3.select("img")
                        .style("opacity", "1");

                    //Hide these elements in this section
                    d3.select(".chartContainer .bubbleChartDescription")
                        .style("opacity", "0");
                    d3.select(".chartContainer .hoverTip h3")
                        .style("opacity", "0");
                    d3.selectAll(".bubbleChart")
                        .style("opacity", "0");

                    //Make the buttons inactive in this section
                    document.querySelector(".total").classList.add("disabledSection");
                    document.querySelector(".age").classList.add("disabledSection");
                    document.querySelector(".sex").classList.add("disabledSection");

                    //Remove the click trigger from the buttons
                    d3.select(".total").on("click", null);
                    d3.select(".age").on("click", null);
                    d3.select(".sex").on("click", null);

                    sectionPlayed = 0; //Change the sectionPlayed so this section will only run once
                }

            }

            /* =============== SECTION 2 =============== */
            else if (window.pageYOffset >= indicatorOne && window.pageYOffset < indicatorTwo) {

                if (sectionPlayed == 0) { //Check if this section is able to run

                    //Show these elements in this section
                    d3.select(".chartContainer .bubbleChartDescription")
                        .style("opacity", "1");
                    d3.select(".chartContainer .hoverTip h3")
                        .style("opacity", "1");
                    d3.select(".bubbleChart")
                        .style("opacity", "1");

                    //Hide these elements in this section
                    d3.select("img")
                        .style("opacity", "0");
                    d3.select(".yearsContainer")
                        .style("opacity", "0");

					//Remove the tip when the user hovered over a circle
		            d3.selectAll(".bubble").on("mouseover", function() {
						//Remove the tip when the user hovered over a circle
		                d3.select(".chartContainer .hoverTip h3")
		                    .style("display", "none");
		            });

                    //Change the tooltip back to normal
                    svgBubbleChart.selectAll(".bubble") //Selects all the circles
                        .on("mousemove", function(d) { //Displays the circles data into a tooltip
                            if (d.wie == "Iedereen") {
                                tooltipGrouped
                                    .style("top", "50%")
                                    .style("left", "50%")
                                    .style("opacity", "1")
                                    .style("color", "#0a5ab9")
                                    .style("transform", "translate(-50%, -50%)")
                                    .style("background", "none")
                                    .style("padding", "20px 0 0 0")
                                    .style("box-shadow", "0 0 0 0 rgba(0, 0, 0, 0.2)")
                                    .style("border-radius", "0")
                                    .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Periode:</span> <span class='tooltipAnswer'>" + (d.periode) + "</span>");
                                d3.select(".tooltipGroupedPercentage")
                                    .style("color", "#0a5ab9");
                                d3.select(".tooltipLabel")
                                    .style("color", "#0a5ab9");
                            } else {
                                tooltipGrouped
                                    .style("top", "50%")
                                    .style("left", "50%")
                                    .style("opacity", "1")
                                    .style("color", "#0a5ab9")
                                    .style("transform", "translate(-50%, -50%)")
                                    .style("background", "none")
                                    .style("padding", "20px 0 0 0")
                                    .style("box-shadow", "0 0 0 0 rgba(0, 0, 0, 0.2)")
                                    .style("border-radius", "0")
                                    .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Periode:</span> <span class='tooltipAnswer'>" + (d.periode) + "</span><br><span class='tooltipLabel'>Wie:</span> <span class='tooltipAnswer'>" + (d.wie) + "</span>");
                                d3.select(".tooltipGroupedPercentage")
                                    .style("color", "#0a5ab9");
                                d3.select(".tooltipLabel")
                                    .style("color", "#0a5ab9");
                            }
                        });

                    //Make the buttons active in this section
                    document.querySelector(".total").classList.remove("disabledSection");
                    document.querySelector(".age").classList.remove("disabledSection");
                    document.querySelector(".sex").classList.remove("disabledSection");

                    //Add the click event back to the buttons who weren't disabled
                    if (document.querySelector(".total").classList.contains("disabled")) {
                        d3.select(".total").on("click", null);
                    } else {
                        d3.select(".total").on("click", showTotal);
                    }
                    if (document.querySelector(".age").classList.contains("disabled")) {
                        d3.select(".age").on("click", null);
                    } else {
                        d3.select(".age").on("click", showAge);
                    }
                    if (document.querySelector(".sex").classList.contains("disabled")) {
                        d3.select(".sex").on("click", null);
                    } else {
                        d3.select(".sex").on("click", showSex);
                    }

                    sectionPlayed = 1; //Change the sectionPlayed so this section will only run once

                    if (bubbleChartPlayed == 1) { //The bubblechart has already been made. So this wont run at the start. Instead it got it's only variable to check if it should run. This variable is changed when the bubble charts gets split sothe use can scroll up and give the bubble chart it's radius back.

                        //First animate all the cirlce to the middle
                        simulation
                            .force("y", d3.forceY(0))
                            .force("x", null)
                            .alphaTarget(0.5)
                            .restart();

                        bubbleChartPlayed = 0; //Change the bubbleChartPlayed so the data can animate to another state

                        //After ...ms animate the circles to make a big circle so all the circles will be spread around
                        setTimeout(function() {
                            simulation
                                .force("y", null)
                                .force("r", d3.forceRadial(RadialSize).strength(0.2))
                                .alphaTarget(0.5)
                                .restart();
                        }, 200);
                    }
                }
            }

            /* =============== SECTION 3 =============== */
            else if (window.pageYOffset >= indicatorTwo && window.pageYOffset < indicatorThree) {

                if (sectionPlayed == 1) { //Check if this section is able to run

                    //Show these elements in this section
                    d3.select(".bubbleChart")
                        .style("opacity", "1");
                    d3.select(".yearsContainer")
                        .style("opacity", "1")
                        .style("padding", "150px 0 150px 100px"); //Also change the padding so it wont interfere with the datavisualisation

                    //Hide these elements in this section
                    d3.select(".chartContainer .bubbleChartDescription")
                        .style("opacity", "0");
                    d3.select(".chartContainer .hoverTip h3")
                        .style("opacity", "0");
					svgBubbleChartLine.select(".connectionLine")
						.style("stroke", null)
						.style("stroke-width", 0);

					//Remove the mouseover event for the connection line
					d3.selectAll(".bubble").on("mouseover", null);
					//Add a mouseover event back to remove the tip when the user hovers over a circle
		            d3.selectAll(".bubble").on("mouseover", function() {
		                d3.select(".chartContainer .hoverTip h3")
		                    .style("display", "none");
		            });

                    //Change the tooltip in this section
                    svgBubbleChart.selectAll(".bubble") //Selects all the circles
                        .on("mousemove", function(d) { //Displays the circles data into a tooltip
                            if (d.wie == "Iedereen") {
                                tooltipGrouped
                                    .style("top", d3.event.pageY - window.pageYOffset + "px")
                                    .style("left", "50%")
                                    .style("opacity", "1")
                                    .style("color", "#0176FF")
                                    .style("transform", "translate(60px, -50%)")
                                    .style("background", "#FFFFFF")
                                    .style("padding", "30px 10px 10px 10px")
                                    .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                    .style("border-radius", "5px")
                                    .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span>");
                                d3.select(".tooltipGroupedPercentage")
                                    .style("color", "#0176FF");
                                d3.selectAll(".tooltipLabel")
                                    .style("color", "#0176FF");
                            } else {
                                tooltipGrouped
                                    .style("top", d3.event.pageY - window.pageYOffset + "px")
                                    .style("left", "50%")
                                    .style("opacity", "1")
                                    .style("color", "#0176FF")
                                    .style("transform", "translate(100px, -50%)")
                                    .style("background", "#FFFFFF")
                                    .style("padding", "30px 10px 10px 10px")
                                    .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                    .style("border-radius", "5px")
                                    .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Wie:</span> <span class='tooltipAnswer'>" + (d.wie) + "</span>");
                                d3.select(".tooltipGroupedPercentage")
                                    .style("color", "#0176FF");
                                d3.selectAll(".tooltipLabel")
                                    .style("color", "#0176FF");
                            }
                        });

                    //Make the buttons inactive in this section
                    document.querySelector(".total").classList.add("disabledSection");
                    document.querySelector(".age").classList.add("disabledSection");
                    document.querySelector(".sex").classList.add("disabledSection");

                    //Remove the click trigger from the buttons
                    d3.select(".total").on("click", null);
                    d3.select(".age").on("click", null);
                    d3.select(".sex").on("click", null);

                    sectionPlayed = 0; //Change the sectionPlayed so this section will only run once

                    //Split the group of bubbles into 5 years on the Y axis
                    if (bubbleChartPlayed == 0) {
                        simulation
                            .force("r", d3.forceRadial(0))
							// .force("collide", d3.forceCollide(function(d) {
						    //     return circleSize(d.percentage) + 0.5; //Ensures the circles don't go on top of each other, this force depends on the value and is different for each circle
						    // }))
                            .force("y", yearsSplit) //This will give each year their own force so the bubbles with be separated accordingly
                            .force("x", null)
                            .alphaTarget(0.3)
                            .restart();

                        bubbleChartPlayed = 1; //Change the bubbleChartPlayed so the data can animate to another state
                    }
                }

            }

            /* =============== SECTION 4 =============== */
            else if (window.pageYOffset >= indicatorThree && window.pageYOffset < indicatorFour) {
                if (sectionPlayed == 0) { //Check if this section is able to run

                    //Show these elements in this section
                    d3.select(".bubbleChart")
                        .style("opacity", "1");
                    d3.select(".yearsContainer")
                        .style("opacity", "1")
                        .style("padding", "110px 0 190px 0");

                    //Hide these elements in this section
                    d3.select(".map")
                        .style("opacity", "0")
                        .style("transform", "translate(9999px)");
                    d3.select(".chartContainer .mapDescription")
                        .style("opacity", "0");

                    //Add disabled class to all yearButtons
                    var yearButtonsHide = document.querySelectorAll('.yearButton');
                    for (var i = 0; i < yearButtonsHide.length; ++i) {
                        yearButtonsHide[i].classList.add("disabledSection");
                    }

                    /* =============== CONNECTION LINES =============== */

                    //Give each circle a mouseover trigger
                    d3.selectAll(".bubble").on("mouseover", function() {

						//Remove the tip when the user hovers over a circle
		                d3.select(".chartContainer .hoverTip h3")
		                    .style("display", "none");

                        //Store multiple attributes of the hovered circle in variables
                        var activeType = this.getAttribute("soort");
                        var activeAudience = this.getAttribute("wie");
                        var activeColor = this.getAttribute("fill");

                        //Select the created <polyline> element
                        svgBubbleChartLine.select(".connectionLine")
                            .style("stroke", function(d) {
                                return activeColor; //Return the same color as the hovered circle
                            })
                            .style("stroke-width", 2)
                            .style("fill", "none")
                            .attr("points", function(d) {

                                var lasterLine = []; //Create an array in which the positions of each corresponding circle gets stored
                                var allBubbles = document.querySelectorAll(".bubble"); //Select all the circles
                                //Loops through each circle
                                for (var i = 0; i < allBubbles.length; i++) {

                                    //If the circles attribute values matches the hovered attribute values ...
                                    if (activeType == allBubbles[i].getAttribute("soort") && activeAudience == allBubbles[i].getAttribute("wie")) {
                                        // .... Then store its Y and X position
                                        var circlePosition = {
                                            positionY: Number(allBubbles[i].getAttribute("cy").slice(0, 6)),
                                            positionX: Number(allBubbles[i].getAttribute("cx").slice(0, 6))
                                        };
                                        //Push the object in the array as a new entry
                                        lasterLine.push(circlePosition);
                                    }
                                }

                                //Return the correct positions of each circle as points for the <polyline> element
                                return lasterLine[0].positionX + "," + lasterLine[0].positionY + "," + lasterLine[1].positionX + "," + lasterLine[1].positionY + "," + lasterLine[2].positionX + "," + lasterLine[2].positionY + "," + lasterLine[3].positionX + "," + lasterLine[3].positionY + "," + lasterLine[4].positionX + "," + lasterLine[4].positionY;

                            });

                    });

                    /* =============== CONNECTION LINES END =============== */

                    //Change the tooltip in this section
                    svgBubbleChart.selectAll(".bubble") //Selects all the circles
                        .on("mousemove", function(d) { //Displays the circles data into a tooltip
                            //Again, since I can't place a function inside the .html I had to copy the code 5 times. But it just gives each years tooltip their own Y postion.
                            if (d.periode == "2012") {
                                if (d.wie == "Iedereen") {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, -450px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                } else {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, -480px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Wie:</span> <span class='tooltipAnswer'>" + (d.wie) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                }
                            }
                            if (d.periode == "2013") {
                                if (d.wie == "Iedereen") {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, -280px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                } else {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, -300px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Wie:</span> <span class='tooltipAnswer'>" + (d.wie) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                }
                            }
                            if (d.periode == "2014") {
                                if (d.wie == "Iedereen") {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, -120px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                } else {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, -130px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Wie:</span> <span class='tooltipAnswer'>" + (d.wie) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                }
                            }
                            if (d.periode == "2015") {
                                if (d.wie == "Iedereen") {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, 50px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                } else {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, 35px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Wie:</span> <span class='tooltipAnswer'>" + (d.wie) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                }
                            }
                            if (d.periode == "2016") {
                                if (d.wie == "Iedereen") {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, 220px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                } else {
                                    tooltipGrouped
                                        .style("top", "50%")
                                        .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
                                        .style("opacity", "1")
                                        .style("color", "#0176FF")
                                        .style("transform", "translate(-50%, 200px)")
                                        .style("background", "#FFFFFF")
                                        .style("padding", "20px 10px 10px 10px")
                                        .style("box-shadow", "0 10px 10px -6px rgba(0, 0, 0, 0.2)")
                                        .style("border-radius", "5px")
                                        .html("<span class='tooltipGroupedPercentage'>" + (d.percentage) + "</span>%<br><span class='tooltipLabel'>Soort:</span> <span class='tooltipAnswer'>" + (d.wat) + "</span><br><span class='tooltipLabel'>Wie:</span> <span class='tooltipAnswer'>" + (d.wie) + "</span>");
                                    d3.select(".tooltipGroupedPercentage")
                                        .style("font-size", "40px")
                                        .style("color", "#0176FF");
                                    d3.selectAll(".tooltipLabel")
                                        .style("color", "#0176FF");
                                }
                            }
                        });

                    if (bubbleChartPlayed == 1) {
                        simulation
                            .force("r", d3.forceRadial(0)) //Removes the radial force
							// .force("collide", d3.forceCollide(0))
                            .force("y", yearsSplit) //Splits the bubbles into 5 years.
                            .force("x", scatterPlot) //Forces the bubblechart to change into a scatterplot. Essentially it trigger a function.
                            .alphaTarget(0.5) //Kinda same as the strength it moves in
                            .restart(); //Restart the simulation for the circles to move again. Otherwise their movement will become less and less over time.

                        bubbleChartPlayed = 0; //Change the bubbleChartPlayed so the data can animate to another state
                    }

                    sectionPlayed = 1; //Change the sectionPlayed so this section will only run once
                }

            }

            /* =============== SECTION 5 =============== */
            else if (window.pageYOffset >= indicatorFour && window.pageYOffset < indicatorFive) {
                if (sectionPlayed == 1) { //Check if this section is able to run

                    //Show these elements in this section
                    d3.select(".chartContainer .mapDescription")
                        .style("opacity", "1");
                    d3.select(".map")
                        .style("opacity", "1")
                        .style("transform", "translate(-50%, -50%)");
                    //Remove disabled class to all yearButtons
                    var yearButtonsHide2 = document.querySelectorAll('.yearButton');
                    for (var b = 0; b < yearButtonsHide2.length; ++b) {
                        yearButtonsHide2[b].classList.remove("disabledSection");
                    }

                    //Hide these elements in this section
                    d3.select(".bubbleChart")
                        .style("opacity", "0");
                    d3.select(".yearsContainer")
                        .style("opacity", "0");
                    d3.select(".barChartContainer")
                        .style("opacity", "0")
                        .style("transform", "translate(9999px)");
                    d3.select(".chartContainer .barChartDescription")
                        .style("opacity", "0");
					svgBubbleChartLine.select(".connectionLine")
						.style("stroke", null)
						.style("stroke-width", 0);

					//Remove the mouseover event for the connection line
					d3.selectAll(".bubble").on("mouseover", null);
					//Add a mouseover event back to remove the tip when the user hovers over a circle
		            d3.selectAll(".bubble").on("mouseover", function() {
		                d3.select(".chartContainer .hoverTip h3")
		                    .style("display", "none");
		            });

                    sectionPlayed = 0; //Change the sectionPlayed so this section will only run once
                }

            }

            /* =============== SECTION 6 =============== */
            else if (window.pageYOffset >= indicatorFive && window.pageYOffset < indicatorSix) {
                if (sectionPlayed == 0) { //Check if this section is able to run

                    //Show these elements in this section
                    d3.select(".chartContainer .barChartDescription")
                        .style("opacity", "1");
                    d3.select(".barChartContainer")
                        .style("opacity", "1")
                        .style("transform", "translate(-50%, -50%)");

                    //Hide these elements in this section
                    d3.select(".map")
                        .style("opacity", "0")
                        .style("transform", "translate(9999px)");
                    d3.select(".chartContainer .mapDescription")
                        .style("opacity", "0");
                    //Add disabled class to all yearButtons
                    var yearButtonsHide3 = document.querySelectorAll('.yearButton');
                    for (var a = 0; a < yearButtonsHide3.length; ++a) {
                        yearButtonsHide3[a].classList.add("disabledSection");
                    }

                    //Change the header and description so it shows the correct explanation
                    document.querySelector(".barChartDescription h2").innerHTML = "Slachtoffers van cyberpesten";
                    document.querySelector(".barChartDescription h3").innerHTML = "Totaal percentages per jaar.";

                    barChartGroupedCheck = 0; //Change the barChartGroupedCheck so the data can change to another state

                    d3.tsv("data/data_bar_totaal.tsv", function(error, dataBarTotal) { //Load the data
                        if (error) throw error;

                        y.domain([2.8, 3.3]); //Change the y domain

                        svgBarChart.selectAll(".bar")
                            .data(dataBarTotal)
                            .attr("yValue", function(d) {
                                return y(d.percentage);
                            })
                            .transition()
                            .attr("class", "bar")
                            .attr("x", function(d) {
                                return x(d.periode);
                            })
                            .attr("width", x.bandwidth())
                            .attr("y", function(d) {
                                return y(d.percentage);
                            })
                            .attr("height", function(d) {
                                return height - y(d.percentage);
                            });

                        var indexBarY = 0; //Make a variable with will increment each time a new text with class .value gets created

                        svgBarChart.selectAll(".value")
                            .data(dataBarTotal)
                            .transition()
                            .attr("y", function(d) {
                                var allBars = document.querySelectorAll(".barChart .barContainer .bar"); //Store all the bars into an array
                                var valueYPosition = Number(allBars[indexBarY].getAttribute("yValue")) + 30; //Get the yValues of the bar and add 30 to it
                                indexBarY++; //Increment the variable so it get the value of the other bars the next time
                                return valueYPosition;
                            })
                            .text(function(d) {
                                return (d.percentage + "%");
                            });

                    });

                    sectionPlayed = 1; //Change the sectionPlayed so this section will only run once
                }

            }

            /* =============== SECTION 7 =============== */
            else if (window.pageYOffset >= indicatorSix && window.pageYOffset < indicatorSeven) {
                if (sectionPlayed == 1) { //Check if this section is able to run

                    //Change the header and description so it shows the correct explanation
                    document.querySelector(".barChartDescription h2").innerHTML = "Bevolking van Nederland";
                    document.querySelector(".barChartDescription h3").innerHTML = "Totaal aantal per jaar.";

                    if (barChartGroupedCheck == 0) {

                        d3.tsv("data/data_bar_bevolking.tsv", function(error, dataBarTotal) {
                            if (error) throw error;

                            y.domain([16600000, 16979120]); //Change the y domain

                            svgBarChart.selectAll(".bar")
                                .data(dataBarTotal)
                                .attr("yValue", function(d) {
                                    return y(d.aantal);
                                })
                                .transition() //Animate the bars
                                .attr("class", "bar")
                                .attr("x", function(d) {
                                    return x(d.periode);
                                })
                                .attr("width", x.bandwidth())
                                .attr("y", function(d) {
                                    return y(d.aantal);
                                })
                                .attr("height", function(d) {
                                    return height - y(d.aantal);
                                });

                            var indexBarY = 0; //Make a variable with will increment each time a new text with class .value gets created

                            svgBarChart.selectAll(".value")
                                .data(dataBarTotal)
                                .transition() //Animate the values
                                .attr("y", function(d) {
                                    var allBars = document.querySelectorAll(".barChart .barContainer .bar"); //Store all bars inside an array
                                    var valueYPosition = Number(allBars[indexBarY].getAttribute("yValue")) + 30; //Get the value of yValue from the bar which is currently targeted with indexBarY
                                    indexBarY++; //Increment indexBarY
                                    return valueYPosition; //Return the y position
                                })
                                .text(function(d) {
                                    return (d.aantal);
                                });

                        });

                    } else {

                        d3.tsv("data/data_bar_bevolking.tsv", function(error, dataBarTotal) {
                            if (error) throw error;

                            //Remove all the .barContainers
                            svgBarChart.selectAll(".barContainer")
                                .remove();
                            //Remove the X axis
                            svgBarChart.selectAll(".axisX")
                                .remove();

                            x.domain(dataBarTotal.map(function(d) {
                                return d.periode;
                            }));

                            y.domain([16600000, 16979120]); //Change the y domain

                            //Create new bars inside the barchart
                            svgBarChart.selectAll(".bar")
                                .data(dataBarTotal)
                                .enter().append("g")
                                .attr("class", "barContainer")
                                .append("rect")
                                .attr("class", "bar")
                                .attr("x", function(d) {
                                    return x(d.periode);
                                })
                                .attr("width", x.bandwidth())
                                .attr("y", function(d) {
                                    return y(d.aantal);
                                })
                                .attr("height", function(d) {
                                    return height - y(d.aantal);
                                })
                                .style("fill", function(d) { //Give each year their own color
                                    if (d.periode == 2012) {
                                        return "#0b6ad9";
                                    } else if (d.periode == 2013) {
                                        return "#0861CA";
                                    } else if (d.periode == 2014) {
                                        return "#0c5ab6";
                                    } else if (d.periode == 2015) {
                                        return "#11509a";
                                    } else if (d.periode == 2016) {
                                        return "#0A4890";
                                    }
                                });

                            //Make two variables with will increment each time a new text with class .value gets created
                            indexBarX = 0;
                            indexBarY = 0;

                            svgBarChart.selectAll(".barContainer")
                                .append("text")
                                .attr("class", "value")
                                .attr("y", function(d) {
                                    var allBars = document.querySelectorAll(".barChart .barContainer .bar"); //Store all bars inside an array
                                    var valueYPosition = Number(allBars[indexBarY].getAttribute("y")) + 30; //Get the value of yValue from the bar which is currently targeted with indexBarY
                                    indexBarY++; //Increment indexBarY
                                    return valueYPosition;
                                })
                                .attr("x", function(d) {
                                    var allBars = document.querySelectorAll(".barChart .barContainer .bar"); //Store all bars inside an array
                                    var valueXPosition = Number(allBars[indexBarX].getAttribute("x")) + 48; //Get the value of x from the bar which is currently targeted with indexBarX
                                    indexBarX++; //Increment indexBarX
                                    return valueXPosition;
                                })
                                .attr("text-anchor", "middle")
                                .text(function(d) {
                                    return (d.aantal);
                                });

                            //Create a new X axis
                            svgBarChart.append("g")
                                .attr("class", "axisX")
                                .attr("transform", "translate(0," + height + ")")
                                .call(d3.axisBottom(x));

                        });
                    }
                    sectionPlayed = 0; //Change the sectionPlayed so this section will only run once
                }
            }

            /* =============== SECTION 8 =============== */
            else if (window.pageYOffset >= indicatorSeven) {
                if (sectionPlayed == 0) { //Check if this section is able to run

                    //Change the header and description so it shows the correct explanation
                    document.querySelector(".barChartDescription h2").innerHTML = "Verschil in cijfers tussen de twee";
                    document.querySelector(".barChartDescription h3").innerHTML = "Percentages tussen 2014 en 2016.";

                    barChartGroupedCheck = 1; //Change the barChartGroupedCheck so the data can change to another state

                    d3.tsv("data/data_bar_verschil.tsv", function(error, dataBarTotal) { //Load the data
                        if (error) throw error;

                        svgBarChart.selectAll(".barContainer")
                            .remove();
                        svgBarChart.selectAll(".axisX")
                            .remove();

                        //Specify the x domain so it knows there are 10 different bars
                        x.domain(dataBarTotal.map(function(d) {
                            return d.id;
                        }));
                        y.domain([0, 72]); //Change the y domain

                        //Create new bars inside the barchart
                        svgBarChart.selectAll(".bar")
                            .data(dataBarTotal)
                            .enter().append("g")
                            .attr("class", "barContainer")
                            .append("rect")
                            .attr("class", "bar")
                            .attr("x", function(d) {
                                return x(d.id);
                            })
                            .attr("width", x.bandwidth())
                            .attr("yValue", function(d) {
                                return y(d.percentage);
                            })
                            .attr("y", height)
                            .attr("height", "0")
							.style("fill", function(d) {
                                if (d.id == 1 || d.id == 3 || d.id == 5 || d.id == 7 || d.id == 9) {
                                    return "#0c5ab6"; //Give each odd bar a colors
                                } else {
                                    return "#0A4890"; //Give each even bar a different color
                                }
                            })
                            .transition() //Animatting the size
                            .attr("y", function(d) {
                                return y(d.percentage);
                            })
                            .attr("height", function(d) {
                                return height - y(d.percentage);
                            });

                        //Make two variables with will increment each time a new text with class .value gets created
                        indexBarX = 0;
                        indexBarY = 0;

                        svgBarChart.selectAll(".barContainer")
                            .append("text")
                            .attr("class", "value")
                            .attr("text-anchor", "middle")
                            .text(function(d) {
                                return (d.percentage + "%");
                            })
                            .attr("x", function(d) {
                                var allBars = document.querySelectorAll(".barChart .barContainer .bar"); //Store all bars inside an array
                                var valueXPosition = Number(allBars[indexBarX].getAttribute("x")) + 24; //Get the value of xValue from the bar which is currently targeted with indexBarX
                                indexBarX++; //Increment indexBarX
                                return valueXPosition;
                            })
                            .attr("y", height)
                            .transition() //Animatting the size
                            .attr("y", function(d) {
                                var allBars = document.querySelectorAll(".barChart .barContainer .bar"); //Store all bars inside an array
                                var valueYPosition = Number(allBars[indexBarY].getAttribute("yValue")) - 10; //Get the value of yValue from the bar which is currently targeted with indexBarY
                                indexBarY++; //Increment indexBarY
                                return valueYPosition;

                            });

                        //Change the x.domain so it shows the correct subjects
                        x.domain(dataBarTotal.map(function(d) {
                            return d.soort;
                        }));

                        //Create the X axis
                        svgBarChart.append("g")
                            .attr("class", "axisX")
                            .attr("transform", "translate(0," + height + ")")
                            .call(d3.axisBottom(x));

                    });
                    sectionPlayed = 1; //Change the sectionPlayed so this section will only run once
                }
            }
        }

        function movingIn() { //Place the circles accordingly
            svgBubbleChart.selectAll(".bubble")
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        }

        function showTotal() {

            //Add a diabled class for the current button and remove it for the others
            document.querySelector(".total").classList.add("disabled");
            document.querySelector(".age").classList.remove("disabled");
            document.querySelector(".sex").classList.remove("disabled");

            //Remove the click trigger on the current button
            d3.select(".total").on("click", null);
            d3.select(".age").on("click", showAge);
            d3.select(".sex").on("click", showSex);

            //Change the description
            document.querySelector(".chartContainer h3").innerHTML = "Gesorteerd op soorten van cyberpesten.";

            //Remove all current circles
            svgBubbleChart.selectAll(".bubble").remove();

            //Load the new data
            d3.tsv("data/data_totaal.tsv", function(error, data) {
                dataset = data; //Save the data into another variable

                insertCircles(); //Create new circles with the new dataset loaded

                // Run a simulation on every circle (node)
                simulation.nodes(data)
                    .on('tick', movingIn) // Run movingIn on every "tick" of the clock
                    .force("y", null)
                    .force("r", d3.forceRadial(RadialSize).strength(0.2))
                    .alphaTarget(0.5)
                    .restart();
            });

        }

        function showAge() {

            //Add a diabled class for the current button and remove it for the others
            document.querySelector(".total").classList.remove("disabled");
            document.querySelector(".age").classList.add("disabled");
            document.querySelector(".sex").classList.remove("disabled");

            //Remove the click trigger on the current button
            d3.select(".total").on("click", showTotal);
            d3.select(".age").on("click", null);
            d3.select(".sex").on("click", showSex);

            //Change the description
            document.querySelector(".chartContainer h3").innerHTML = "Gesorteerd op leeftijden en soorten.";

            //Remove all current circles
            svgBubbleChart.selectAll(".bubble").remove();

            //Load the new data
            d3.tsv("data/data_leeftijden.tsv", function(error, data) {
                dataset = data; //Save the data into another variable

                insertCircles(); //Create new circles with the new dataset loaded

                // Run a simulation on every circle (node)
                simulation.nodes(data)
                    .on('tick', movingIn) // Run movingIn on every "tick" of the clock
                    .force("y", null)
                    .force("r", d3.forceRadial(RadialSize).strength(0.2))
                    .alphaTarget(0.5)
                    .restart();
            });

        }

        function showSex() {

            //Add a diabled class for the current button and remove it for the others
            document.querySelector(".total").classList.remove("disabled");
            document.querySelector(".age").classList.remove("disabled");
            document.querySelector(".sex").classList.add("disabled");

            //Remove the click trigger on the current button and add on the others
            d3.select(".total").on("click", showTotal);
            d3.select(".age").on("click", showAge);
            d3.select(".sex").on("click", null);

            //Change the description
            document.querySelector(".chartContainer h3").innerHTML = "Gesorteerd op geslacht en soorten.";

            //Remove all current circles
            svgBubbleChart.selectAll(".bubble").remove();

            //Load the new data
            d3.tsv("data/data_geslacht.tsv", function(error, data) {
                dataset = data; //Save the data into another variable

                insertCircles(); //Create new circles with the new dataset loaded

                // Run a simulation on every circle (node)
                simulation.nodes(data)
                    .on('tick', movingIn) // Run movingIn on every "tick" of the clock
                    .force("y", null)
                    .force("r", d3.forceRadial(RadialSize).strength(0.2))
                    .alphaTarget(0.5)
                    .restart();
            });

        }

        function audioPlay() {
            bullyBully.play(); //If the h1 gets hovered, play the mp3
            document.querySelector(".audioChange").innerHTML = "bullies"; //Also change the title to give it some context
        }

        function audioStop() {
            bullyBully.pause(); //On mouseout pause the mp3
            bullyBully.currentTime = 0; //Also reset the mp3 so it starts at the beginning again
            document.querySelector(".audioChange").innerHTML = "pesten"; //Change the title back
        }

    }); //END BARCHART

}); //END BUBBLE CHART

/* =============== ANIMATING THE ELEMENTS IN =============== */

//Global animation settings of ScrollReveal
window.sr = ScrollReveal({
    reset: false, //Don't repeat the animations
});

//Animating the .info and .tip elements
sr.reveal('.info, .tip', {
    duration: 500,
    distance: "50px", //Slides 50px up
    opacity: 0, //Starts with 0 opacity
    viewFactor: 0.9 //Animates when 90% of the element is visible
});

//Start at the top of the page on reload
window.onbeforeunload = function() {
    window.scrollTo(0, 0); //Scroll to the top when the page gets loaded
};
