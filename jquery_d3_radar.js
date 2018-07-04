 $(document).ready(function(){
 var input=d3.select('body').append('form').attr('id','form1').attr('method','post').attr('action','/').append('input');
 input.attr('id','item1').attr('name','item').attr('type','text').attr('value','搜索何人');
 d3.select('#form1').append('button').append('p').append('input').attr('id','subnow').attr('type','submit').attr('value','搜索');
        $('form').submit(function(e){
            //alert($(#item1).attr('method'))
            //alert($('#item1').get(0).value);
            var search_word = $('#item1').get(0).value+".json";
            e.preventDefault();
            //alert("Submit prevented");
            $.post( (encodeURIComponent(search_word)), function( json ) {
            var li=d3.select('body')
                .append('ul')
                    .append('li')
                        .text('赞同'+json['赞同']+'\n'+'收益'+json['收益']+'\n'+'回答总字数'+json['回答总字数']+'\n'+'回复数'+json['回复数'])
                        .style('color','#123456');
            li.append('li').text('回答总字数='+json['回答总字数']).style('color','#f2f2f4');
            li.append('li').text('被关注='+json['关注他人']).style('color','#f2f2f4');
            li.append('li').text('回复数='+json['回复数']).style('color','#f2f2f4');
            li.append('li').text('平均被赞='+json['每个回答平均获赞数']).style('color','#f2f2f4');
            li.append('li').text('最近回复日期='+json['最后一次回复的日期']).style('color','#f2f2f4');
            li.append('li').text('回答平均字数='+json['回答平均字数']).style('color','#f2f2f4');
            li.append('li').text('关注他人='+json['被关注']).style('color','#f2f2f4');
             var width = 200,
    height = 200;
var config = {
    w: width,
    h: height,
    maxValue: 100,
    levels: 5,
    ExtraWidthX: 300
};
var data_source = [[{"area": "勤奋", "value": 80},
      {"area": "收益", "value": 40},
      {"area": "魅力", "value": 40},
      {"area": "文采", "value": 90},
      {"area": "爱心", "value": 60},]];
data_source[0][0].value=json['回复数']/1360*100;
data_source[0][1].value=json['收益']/20000*100;
data_source[0][2].value=json['关注他人']/550*100;
data_source[0][3].value=(json['回答总字数']/350000+json['回答平均字数']/500)/2*100;
data_source[0][4].value=json['给他人点赞数']/2000*100;
RadarChart.draw("#chart", data_source, config);
var svg = d3.select('body')
	.selectAll('svg')
	.append('svg')
	.attr("width", width)
	.attr("height", height);return false;}); return false;});});


