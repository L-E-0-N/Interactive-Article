# **Project 1.C**

![][cover]

## **Github Page**
[Github Page](https://leonvanzijl.github.io/Interactive-Article/)

## **Background**
In this assignment I’ve created an interactive article explaining what cyberbullying is and how it's affecting The Netherlands. The user can interact with the data to show different aspects of the used datasets. The data itself will also be changing throughout the article so it shows datavisualisations of the chapters you're reading at that moment.

## **Concept**
Luckily my Research for Data subject was rich with datasets so I could easily use that as my subject for this assignment. First of all I viewed plenty of datavisualisations to understand how other people used them to communicate the data to their readers. After I got some inspiration I created 3 concepts:

![][concept]

**A**: This is a dashboard with steps. You go through the steps by click the next / previous button. Each step a new insight it shown with a fitting description.

**B**: Since I got quite a lot of context out of my research case I could use, I wanted to get one concept which would use the full benefits of it. So I came up with an interactive article. Like described above, the user can interactive with the data and the data will update according to the chapters that's being read. Since the left side is an article you can place as much context in it as you like.

**C**: This is a dashboard without any context. All the data was shown on one page with little to no context. The challenge here is to make the datavisualisations as easily understandable as possible. So the users wouldn't need any context.

So I had three concepts, one with little to no context (**C**). One with a bit more freedom (**A**) and one with endless freedom (**B**). I choose for concept **B** because I wanted to use my research case and actually think it will benefit the user. Another reason was because the dashboards were less innovative to my knowledge. It's just clicking buttons to view the next step / or none at all. With the interactive article you can easily go a couple of steps further or back by scrolling up or down. My coach also said that concept **B** would be good enough to pass as both assignment A & B if it would work properly.

**Steps**

2. Started building the d3 bubble chart
3. Used multiple forces to make the "bubbles" separate
```javascript
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
```
4. At this point I got a basic bubblechart running and I needed the content. So I used the research done before and wrote a quick article.
5. Next I needed to divide the article into multiple section so each section would trigger an event
```javascript
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
	    }

	    /* =============== SECTION 2 =============== */
	    else if (window.pageYOffset >= indicatorOne && window.pageYOffset < indicatorTwo) {
	    }

	    /* =============== SECTION 3 =============== */
	    else if (window.pageYOffset >= indicatorTwo && window.pageYOffset < indicatorThree) {
	    }

	    /* =============== SECTION 4 =============== */
	    else if (window.pageYOffset >= indicatorThree && window.pageYOffset < indicatorFour) {
	    }

	    /* =============== SECTION 5 =============== */
	    else if (window.pageYOffset >= indicatorFour && window.pageYOffset < indicatorFive) {
	    }

	    /* =============== SECTION 6 =============== */
	    else if (window.pageYOffset >= indicatorFive && window.pageYOffset < indicatorSix) {
	    }

	    /* =============== SECTION 7 =============== */
	    else if (window.pageYOffset >= indicatorSix && window.pageYOffset < indicatorSeven) {
	    }

	    /* =============== SECTION 8 =============== */
	    else if (window.pageYOffset >= indicatorSeven) {
	    }
	}
	```
6. Throughout the article multiple elements have an indicator class
```html
	<h2 class="indicatorTitle indicatorOne">Cyberpesten. De cijfers.</h2>
```
```css
	.indicatorTitle:before {
		content:'';
		width: 0;
		height: 0;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-right: 10px solid #0176FF;
		position: absolute;
		transform: translate(-30px, 20px);
	}
```
7. There is also one arrow on the left side at 50% height with a fixed position. As soon as two indicators are passing each other a new section starts
```html
	<div class="indicator"></div>
```
```css
	.indicator {
		width: 0;
		height: 0;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-left: 10px solid #0176FF;
		position: fixed;
		top: 50%;
		left: 0;
		transform: translate(0, -10px);
	}
```
![][indicator]

8. All I needed to do now was trigger the `scroll()` function when someone scrolls
```javascript
	document.querySelector('body').onscroll = scroll;
```
9. At this point I wanted to change thr bubblechart a bit more. So instead of clustering all the circles together and spreading them. I wanted to change the "cluster" state. This code made all the circles cluster into a circle.
```javascript
	var simulation = d3.forceSimulation()
	    .force("r", d3.forceRadial(RadialSize)) //This force makes sure every circle is in a radius of approximately 100px
```
10. As a third state I wanted to create a scatterplot from the bubblecharts. So I, again, used multiple force in the X axis so force the lower percentages left and the higher ones on the right.
	```javascript
	simulation
		.force("r", d3.forceRadial(0)) //Revmoes the radial force
		.force("y", yearsSplit) //Splits the bubbles into 5 years.
		.force("x", scatterPlot) //Forces the bubblechart to change into a scatterplot. Essentially it trigger a function.
		.alphaTarget(0.5) //Kinda same as the strength it moves in
		.restart(); //Restart the simulation for the circles to move again. Otherwise their movement will become less and less over time.

	var scatterPlot = d3.forceX(function(d) {
		var scatterSpread = d3.scaleSqrt().domain([0.1, 5.5]).range([-800, 800]);
		return scatterSpread(d.percentage);
	}).strength(0.05);
```
11. Then came the map. I used a map of the Netherlands with all provinces as individual svgs. The hard part here was connecting the data to the map. So for the starting year (2012) tololtip I made a loop go through each item on the dataset. It then checked if the dataitem has the same year and province name. If that's the case, we got the right dataitem
```javascript
	svgMap.selectAll("path")
		.on("mousemove", function(d) { //Displays the circle its data into a tooltip
		    for (var i = 0; i < dataMap.length; i++) {
		        if (dataMap[i].periode == "2012" && dataMap[i].regio == d.properties.name) {
		            tooltipMap
		                .style("top", d3.event.pageY - window.pageYOffset + "px")
		                .style("left", d3.event.pageX - window.innerWidth / 2 + "px")
		                .style("display", "inline-block")
		                .html("<span class='tooltipGroupedPercentage'>" + (dataMap[i].percentage) + "</span>%<br><span class='tooltipLabel'>Provincie:</span> <span class='tooltipAnswer'>" + (d.properties.name) + "</span>");
		        }
		    }
		})
```
12. For the coloring I used a linear scale.
```javascript
	var color = d3.scaleLinear()
	    .domain([2.2, 2.6, 3.0, 3.4, 3.8, 4.2])
	    .range(["#0b6ad9", "#0861CA", "#0c5ab6", "#11509a", "#0A4890"]);

	svgMap.selectAll("path")
		.attr("fill", function(d) {
            for (var i = 0; i < dataMap.length; i++) {
                if (dataMap[i].periode == "2012" && dataMap[i].regio == d.properties.name) { //Checks if the year and province name are the same as the svg
                    return color(dataMap[i].percentage); //Return the correct color
                }
            }
        })
```
13. Next I made 5 buttons to represent each year.
```html
	<div class="buttonContainerLocation">
		<div class="year2012 yearButton disabledSection">2012</div>
		<div class="year2013 yearButton disabledSection">2013</div>
		<div class="year2014 yearButton disabledSection">2014</div>
		<div class="year2015 yearButton disabledSection">2015</div>
		<div class="year2016 yearButton disabledSection">2016</div>
	</div>
```
14. Each button got a trigger to `showYearMap()`
```javascript
	d3.select(".year2012").on("click", showYearMap);
	d3.select(".year2013").on("click", showYearMap);
	d3.select(".year2014").on("click", showYearMap);
	d3.select(".year2015").on("click", showYearMap);
	d3.select(".year2016").on("click", showYearMap);
```

15. The function stores the class of the button which is pressed so it has the active year
```javascript
	var activeYear = this.className.slice(4, 8); //Get the year of the pressed button
```
16. Then instead of checking for `"2012"` we check for `activeyear`
```javascript
	if (dataMap[i].periode == activeYear && dataMap[i].regio == d.properties.name) {} //Checks if the year and province name are the same as the svg
```
17. Lastly are the barcharts. I loaded the data and set my own `y.domain` value
```javascript
	y.domain([2.8, 3.3]);
```
18. Then I created the bars with each their own color
```javascript
	// Create the bars for the barchart
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
```
19. I wanted the values to show inside / on top of the bars. So I had to calculate the x and y values of each bar and place the text elements on those positions with a bit of offset.
```javascript
	var indexBarX = 1;
	var indexBarY = 1;

	svgBarChart.selectAll(".barContainer")
		.append("text")
		.attr("class", "value")
		.attr("y", function(d) {
			var valueYPosition = Number(document.querySelector(".barChart .barContainer:nth-of-type(" + indexBarY + ") .bar").getAttribute("y")) + 30;
			indexBarY++;
			return valueYPosition;
		})
		.attr("x", function(d) {
			var valueXPosition = Number(document.querySelector(".barChart .barContainer:nth-of-type(" + indexBarX + ") .bar").getAttribute("x")) + 48;
			indexBarX++;
			return valueXPosition;
		})
		.attr("text-anchor", "middle")
		.text(function(d){
			return (d.percentage+"%");
		});
```
20. Now we got the first barchart. When a new section is trigger the barcharts data is changed. This happens because we reload another data file and change the values.
```javascript
	d3.tsv("data_bar_bevolking.tsv", function(error, dataBarTotal) {

		y.domain([16600000, 16979120]);

	});
```
21. For the bars we changed the height and added a `transition()` to animate the effect.
```javascript
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
			console.log(d.aantal);
			return height - y(d.aantal);
		});
```
22. Same goes for the values
```javascript
	var indexBarY = 0;

	svgBarChart.selectAll(".value")
		.data(dataBarTotal)
		.transition() //Animate the values
		.attr("y", function(d) {
			var allBars = document.querySelectorAll(".barChart .barContainer .bar"); //Store all bars insdie an array
			var valueYPosition = Number(allBars[indexBarY].getAttribute("yValue")) + 30; //Get the value of yValue from the bar which is currently targeted with indexBarY
			indexBarY++; //Increment indexBarY
			return valueYPosition; //Return the y position
		})
		.text(function(d) {
			return (d.aantal);
		});
```
23. The last barchart has a different layout so animating it wouldn't look so good. In this case I chose to remove all the existing bars and create new ones.
```javascript
	d3.tsv("data_bar_verschil.tsv", function(error, dataBarTotal) {
		svgBarChart.selectAll(".barContainer")
			.remove();

		svgBarChart.selectAll(".axisX")
			.remove();
	});
```
24. Creating the bars
```javascript
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
		.transition() //Animatting the size
		.attr("y", function(d) {
			return y(d.percentage);
		})
		.attr("height", function(d) {
			return height - y(d.percentage);
		})
		.style("fill", function(d) {
			if (d.id == 1 || d.id == 3 || d.id == 5 || d.id == 7 || d.id == 9) {
				return "#0c5ab6";
			} else {
				return "#0A4890";
			}
		});
```
25. Creating the values and x axis
```javascript
	indexBarX = 0;
	indexBarY = 0;

	svgBarChart.selectAll(".barContainer")
		.append("text")
		.attr("class", "value")
		.attr("text-anchor", "middle")
		.text(function(d){
			return (d.percentage+"%");
		})
		.attr("x", function(d) {
			var allBars = document.querySelectorAll(".barChart .barContainer .bar");
			var valueXPosition = Number(allBars[indexBarX].getAttribute("x")) + 24;
			indexBarX++;
			return valueXPosition;
		})
		.attr("y", height)
		.transition() //Animatting the size
		.attr("y", function(d) {
			var allBars = document.querySelectorAll(".barChart .barContainer .bar");
			var valueYPosition = Number(allBars[indexBarY].getAttribute("yValue")) - 10;
			indexBarY++;
			return valueYPosition;

		});

		x.domain(dataBarTotal.map(function(d) {
			return d.soort;
		}));

		// add the x Axis
		svgBarChart.append("g")
			.attr("class", "axisX")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));
```
26. At this point I spoke with my coach and could use this assignment for both A and B (making it "assignment C"). So I went a bit further. First of all I changed the serif font throughout the article and used a webfont.

27. Next, I had an idea to place connecting lines between the circles when they form a scatterplot. This would indicate the increase or decrease throughout the years a lot easier. So to start it of I had to figure out where I could put this code. Since the circles are calling `movingIn()` on each tick, this would be my best bet.
```javascript
	//Run a simulation on every circle (node)
	simulation.nodes(data)
		.on('tick', movingIn) //Run movingIn on every "tick" of the clock
		.alphaTarget(0.5)
		.restart();
```

28. Since `movingIn()` is running on each tick. I had to make some conditions so the code would only run within the right section of the page.
```javascript
	//Calculating the center of the screen's position compared to the top
	var middleOfScreen = window.innerHeight / 2;
	//Getting the position of <body> to compare it with the indicator for a Y position
	var bodyPosition = document.body.getBoundingClientRect();
	//3rd indicator Y position
	var indicatorThreePosition = document.querySelector(".indicatorThree").getBoundingClientRect();
	var indicatorThree = indicatorThreePosition.top - bodyPosition.top - middleOfScreen + 15;
	//4th indicator Y position
	var indicatorFourPosition = document.querySelector(".indicatorFour").getBoundingClientRect();
	var indicatorFour = indicatorFourPosition.top - bodyPosition.top - middleOfScreen + 15;

	if (window.pageYOffset >= indicatorThree && window.pageYOffset < indicatorFour) {
		//NEXT CODE HERE
	}
```
29. Next I defined some variables and arrays which would help me check each circle and know if it should store the position.
```javascript
	var allBubbleChartCircles = document.querySelectorAll(".bubble");
	var allConnectionLines = document.querySelectorAll(".connectionLine");
	var allTypes = ["Laster", "Chantage", "Stalker", "Bedreiging", "Anders"];
	var allAudiences = ["15 tot 18 jaar", "18 tot 25 jaar", "25 tot 45 jaar", "45 tot 65 jaar", "65+"];
	var allGenders = ["Mannen", "Vrouwen"];
	var allTypesIndex;
	var allAudiencesIndex;
	var connectionLineIndex = 1;
```
29. Next I checked which dataset was active (total, sorted by gender, sorted by age)
```javascript
	if (allBubbleChartCircles[0].getAttribute("wie") == "15 tot 18 jaar") {
		//NEXT CODE HERE
	}
```
30. Then I made a loop so it would create all the 25 lines. Within each loop there was another loop to check each circle. The loops would also go through each array entry by incrementing the indexes each loop or after five loops.
```javascript
	for (var i = 0; i < 25; i++) {
		svgBubbleChart.select(".connectionLine:nth-of-type(" + connectionLineIndex + ")")
			.style("stroke", "red")
			.style("fill", "none")
			.attr("points", function(d) {

				var lasterLine = [];
				var allBubbles = document.querySelectorAll(".bubble");
				for (var i = 0; i < allBubbles.length; i++) {
					//NEXT CODE HERE
				}
			});

		connectionLineIndex++;
		allTypesIndex++;

		if (allTypesIndex > 4) {
			allTypesIndex = 0;
			allAudiencesIndex++;
		}
	}
```

31. If the circles age and type attribute are the same of the ones that are currently being checked, then store the position.
```javascript
	if (allBubbles[i].getAttribute("soort") == allTypes[allTypesIndex] && allBubbles[i].getAttribute("wie") == allAudiences[allAudiencesIndex]) {
		var circleY = Number(allBubbles[i].getAttribute("cy").slice(0,7));
		var circleX = Number(allBubbles[i].getAttribute("cx").slice(0,7));
		var circlePosition = {
			positionY: circleY,
			positionX: circleX
		};
		lasterLine.push(circlePosition);
	}
```
32. Lastly, return the position in the correct format so the <polyline> element can be created
```javascript
return lasterLine[0].positionX + "," + lasterLine[0].positionY + "," + lasterLine[1].positionX + "," + lasterLine[1].positionY + "," + lasterLine[2].positionX + "," + lasterLine[2].positionY + "," + lasterLine[3].positionX + "," + lasterLine[3].positionY + "," + lasterLine[4].positionX + "," + lasterLine[4].positionY;
```

33. Now that I finally had all the lines, it actually didn't look so good and was a bit too chaotic. It also was a bit heavy on the CPU since the code ran on each tick.

![][lines]

34. Sooooo. Another option was to just show the line of the circle which is being hovered. First off I removed everything from `movingIn()` since I didn't want the code to run so often. Then I created a mouseover trigger within the correct section in the `scroll()` function.
```javascript
	//Give each circle a mouseover trigger
	d3.selectAll(".bubble").on("mouseover", function() {
		//NEXT CODE HERE
	}
```
35. Then I stored some attributes of the hovered circle
```javascript
	//Store multiple attributes of the hovered circle in variables
	var activeType = this.getAttribute("soort");
	var activeAudience = this.getAttribute("wie")
	var activeColor = this.getAttribute("fill")
```
36. Select the <polyline> element
```javascript
	svgBubbleChart.select(".connectionLine")
		.style("stroke", function(d) {
			return activeColor; //Return the same color as the hovered circle
		})
		.style("stroke-width", 2)
		.style("fill", "none")
		.attr("points", function(d) {

			//NEXT CODE HERE

		});
```
37. Now again, as previous steps. I created an array which would store all the positions of the corresponding circles.

```javascript
	var lasterLine = []; //Create an array in which the positions of each corresponding circle gets stored
```
38. I selected all the circles and loop through each.
```javascript
	var allBubbles = document.querySelectorAll(".bubble"); //Select all the circles
	//Loops through each circle
	for (var i = 0; i < allBubbles.length; i++) {

		//NEXT CODE HERE

	}
```
39. If the circles attribute values matches the hovered circle attribute values, store the circles Y and X position.
```javascript
	//If the circles attribute values matches the hovered attribute values ...
	if (activeType == allBubbles[i].getAttribute("soort") && activeAudience == allBubbles[i].getAttribute("wie")) {
		// .... Then store its Y and X position
		var circlePosition = {
			positionY: Number(allBubbles[i].getAttribute("cy").slice(0,6)),
			positionX: Number(allBubbles[i].getAttribute("cx").slice(0,6))
		};
		//Push the object in the array as a new entry
		lasterLine.push(circlePosition);
	}
```

40. Lastly return the positions in a correct format for the <polyline> element
```javascript
	//Return the correct positions of each circle as points for the <polyline> element
	return lasterLine[0].positionX + "," + lasterLine[0].positionY + "," + lasterLine[1].positionX + "," + lasterLine[1].positionY + "," + lasterLine[2].positionX + "," + lasterLine[2].positionY + "," + lasterLine[3].positionX + "," + lasterLine[3].positionY + "," + lasterLine[4].positionX + "," + lasterLine[4].positionY;
```

## **Data**
I used multiple datasets for the different graphs / charts. Below are some samples for the datasets.

### Cyberpesten totaal per soort

| wie      | periode | wat        | percentage |
|----------|---------|------------|------------|
| Iedereen | 2012    | Laster     | 1.0        |
| Iedereen | 2012    | Chantage   | 0.3        |
| Iedereen | 2012    | Stalker    | 0.7        |
| Iedereen | 2012    | Bedreiging | 0.6        |
| Iedereen | 2012    | Anders     | 1.1        |
| Iedereen | 2013    | Laster     | 1.1        |
| Iedereen | 2013    | Chantage   | 0.2        |
| Iedereen | 2013    | Stalker    | 0.7        |
| Iedereen | 2013    | Bedreiging | 0.6        |
| Iedereen | 2013    | Anders     | 1.2        |
| Iedereen | 2014    | Laster     | 0.9        |
| Iedereen | 2014    | Chantage   | 0.2        |
| Iedereen | 2014    | Stalker    | 0.7        |
| Iedereen | 2014    | Bedreiging | 0.6        |
| Iedereen | 2014    | Anders     | 1.1        |
| Iedereen | 2015    | Laster     | 1.0        |
| Iedereen | 2015    | Chantage   | 0.8        |
| Iedereen | 2015    | Stalker    | 0.3        |
| Iedereen | 2015    | Bedreiging | 0.5        |
| Iedereen | 2015    | Anders     | 1.1        |
| Iedereen | 2016    | Laster     | 1.0        |
| Iedereen | 2016    | Chantage   | 0.8        |
| Iedereen | 2016    | Stalker    | 0.3        |
| Iedereen | 2016    | Bedreiging | 0.6        |
| Iedereen | 2016    | Anders     | 1.1        |

### Cyberpesten per leeftijd en soort

| wie            | periode | wat        | percentage |
|----------------|---------|------------|------------|  
| 15 tot 18 jaar | 2016    | Bedreiging | 1.8        |
| 15 tot 18 jaar | 2016    | Anders     | 2.9        |
| 18 tot 25 jaar | 2012    | Laster     | 2.6        |
| 18 tot 25 jaar | 2012    | Chantage   | 0.7        |
| 18 tot 25 jaar | 2012    | Stalker    | 2.0        |
| 18 tot 25 jaar | 2012    | Bedreiging | 1.5        |
| 18 tot 25 jaar | 2012    | Anders     | 2.2        |
| 18 tot 25 jaar | 2013    | Laster     | 2.6        |
| 18 tot 25 jaar | 2013    | Chantage   | 0.4        |
| 25 tot 45 jaar | 2016    | Stalker    | 0.3        |
| 25 tot 45 jaar | 2016    | Bedreiging | 0.7        |
| 25 tot 45 jaar | 2016    | Anders     | 1.2        |
| 45 tot 65 jaar | 2012    | Laster     | 0.6        |
| 45 tot 65 jaar | 2012    | Chantage   | 0.2        |
| 45 tot 65 jaar | 2012    | Stalker    | 0.5        |
| 65+            | 2016    | Bedreiging | 0.1        |
| 65+            | 2016    | Anders     | 0.4        |

### Cyberpesten per provincie

| periode | regio         | percentage |
|---------|---------------|------------|  
| 2012    | Groningen     | 4.2        |
| 2012    | Friesland     | 2.2        |
| 2012    | Drenthe       | 3.5        |
| 2012    | Overijssel    | 2.9        |
| 2012    | Flevoland     | 3.1        |
| 2012    | Gelderland    | 2.8        |
| 2012    | Utrecht       | 2.8        |
| 2012    | Noord-Holland | 3.4        |
| 2012    | Zuid-Holland  | 3.1        |
| 2012    | Zeeland       | 3.0        |
| 2012    | Noord-Brabant | 2.9        |
| 2012    | Limburg       | 3.2        |
| 2013    | Groningen     | 3.7        |
| 2013    | Friesland     | 3.7        |
| 2013    | Drenthe       | 3.3        |
| 2013    | Overijssel    | 3.0        |
| 2013    | Flevoland     | 4.1        |
| 2013    | Gelderland    | 3.3        |
| 2013    | Utrecht       | 3.4        |
| 2013    | Noord-Holland | 3.2        |
| 2013    | Zuid-Holland  | 3.4        |
| 2013    | Zeeland       | 3.2        |
| 2013    | Noord-Brabant | 3.2        |
| 2013    | Limburg       | 3.2        |

### Cyberpesten totaal

| periode | percentage |
|---------|------------|
| 2012    | 3.1        |
| 2013    | 3.3        |
| 2014    | 3.1        |
| 2015    | 3.2        |
| 2016    | 3.2        |

### Nederlandse bevolking

| periode | aantal   |
|---------|----------|
| 2012    | 16730348 |
| 2013    | 16779576 |
| 2014    | 16829288 |
| 2015    | 16900726 |
| 2016    | 16979120 |

### Verschil tussen 2014 en 2016

| id | soort               | percentage |
|----|---------------------|------------|
| 1  | Persoonlijk         | 69.7       |
| 2  | Persoonlijk         | 67.4       |
| 3  | Telefoon            | 2          |
| 4  | Telefoon            | 3.4        |
| 5  | Briefjes            | 5.7        |
| 6  | Briefjes            | 4.1        |
| 7  | Mail & Social Media | 5.7        |
| 8  | Mail & Social Media | 7          |
| 9  | Anders              | 34.2       |
| 10 | Anders              | 38.2       |


## **Features**
1. `d3-Domain` - Setting the data
2. [`d3-Scale`](https://github.com/d3/d3-scale) - Position encodings
3. [`d3-Transition`](https://github.com/d3/d3-transition) - Animating elements
4. [`d3-Axis`](https://github.com/d3/d3-axis) - Axes
5. [`d3-Geo`](https://github.com/d3/d3/blob/master/API.md#geographies-d3-geo) - Used for map projections
6. [`Array-Slice`](https://www.w3schools.com/jsref/jsref_slice_array.asp) - Using parts of the array
7. [`Force-Radial`](https://github.com/d3/d3-force/blob/master/README.md#forceRadial)
8. [`Force`](https://github.com/d3/d3-force)
9. [`ScrollReveal`](https://github.com/jlmakes/scrollreveal)
10. [`ScaleOrdinal`](https://github.com/d3/d3-scale/blob/master/README.md#scaleOrdinal)

## **License**
MIT © Leon van Zijl

## **Sources**
1. [`Dataset`](http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=83096ned&D1=185,201,204,207,210,213&D2=0-2,4-8,35-40&D3=0&D4=a&HDR=T&STB=G1,G2,G3&VW=T) - Cyberbullying dataset with all the different kinds.
2. [`Dataset 2`](http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=82464NED&D1=185,201,204,207,210,213&D2=0&D3=6-17&D4=a&HDR=G3,G2&STB=T,G1&VW=T) - Cyberbullying dataset with the provinces
3. [`Svg map`](http://bl.ocks.org/phil-pedruco/9344373) - Map of the Netherlands
4. [`Bubblechart Tutorial`](https://www.youtube.com/watch?v=gda35eYXBJc&t=15) - Guide how to make a simple bubblechart

[cover]: images/cover.png
[indicator]: images/indicators.png
[lines]: images/lines.png
[concept]: images/concepts.png
