function buildCustomCard() {
  return `
    <div class="card ${dataId} ${sessionSelect}" data-id="${dataId}">
      <div class="content">
        <h5 class="ui ${room_color} header">
          <span class="session-time-header">${time}</span>
          <span class="heart-right">
            <i title="Add to Calendar" class="${room_color} heart ${outline} icon add-to-call" onclick="addToCall(${dataId}, this)"></i>
          </span>
        </h5>
        <h4 style="text-align: center;">No Session</h4>
      </div>
      <div class="extra content">
        <div class="ui mini labels session-tags">
          ${tagsHtml}
        </div>
        <div title="Room Capacity: ${capacity}" class="ui circular basic  label no-border">
          ${capacity}
          <i class="icon users"></i>
        </div>
        <div class="ui ${room_color} basic  circular label">
          ${room_sponsor}
        </div>
      </div>
    </div>
  `;
}

/*function buildSingleEmptyCard(this) {
  return `
    <div class="card ${dataId} ${sessionSelect}" data-id="${dataId}">
      <div class="content">
        <h5 class="ui ${room_color} header">
          <span class="session-time-header">${time}</span>
          <span class="heart-right">
            <i title="Add to Calendar" class="${room_color} heart ${outline} icon add-to-call" onclick="addToCall(${dataId}, this)"></i>
          </span>
        </h5>
        <h4 style="text-align: center;">No Session</h4>
      </div>
      <div class="extra content">
        <div class="ui mini labels session-tags">
          ${tagsHtml}
        </div>
        <div title="Room Capacity: ${capacity}" class="ui circular basic  label no-border">
          ${capacity}
          <i class="icon users"></i>
        </div>
        <div class="ui ${room_color} basic  circular label">
          ${room_sponsor}
        </div>
      </div>
    </div>
  `;  
}*/




function buildSessionTimes(data) {
  if (!data) {
    return;
  }
  var allTimes = data.map(function(d) {
    return(d.time.replace(/am/ig, '').replace(/pm/ig, '').trim())
  });
  var times = new Set(allTimes);
  var divs = `<div class="ui labels">`;
  times.forEach(function(d) {
    divs += `<div class="ui grey basic tiny label session-time" onclick="filterBySessionTime('${d}')">${d}</div>`;
  });
  divs += '</div>';

  document.getElementById("times").innerHTML = divs;
}
function buildSessionFavs() {
  var divs = `
    <button class="ui toggle button center floated session-favs" onclick="filterBySessionFav(this)">
      <i title="Show My Sessions" class="heart icon"></i>My Sessions
    </button>
    <div class="ui icon input session-search">
      <input type="text" placeholder="Search..." id="search_sessions">
      <i class="search icon"></i>
    </div>
  `;

  /*var divs = `<div class="ui buttons">`;
  divs += `<div class="ui button active" onclick="filterBySessionFav('all')">All</div>`;
  divs += `<div class="ui button" onclick="filterBySessionFav('fav')">Fav</div>`;
  divs += '</div>';*/

  document.getElementById("favs").innerHTML = divs;
}



// TODO: rethink 'add-to-calendar feature'
function addToCall(data, heart) {
  console.log(data)
  // var card = $('.card.'+data);
  var card = $('.card[data-id="' + data + '"]');
  if (sessions[data]['session-select'] === 'true' || sessions[data]['session-select'] === true) {
    sessions[data]['session-select'] = false;
    card.removeClass('session-select');
    heart.classList.add("outline");
    localStorage.setItem('card'+data, false);
  } else {
    sessions[data]['session-select'] = true;
    card.addClass('session-select');
    heart.classList.remove("outline");
    localStorage.setItem('card'+data, true);
  }
  // OLD: Add to calendar
  /*var event = sessions[data];
  var description = buildEventDescription(event);
  var begin = '4/28/2018 ' + event.time.split('-')[0].trim();
  var end = '4/28/2018 ' + event.time.split('-')[1].trim();
  var beginF = new Date(begin.replace('am', ' am').replace('pm', ' pm'));
  var endF = new Date(end.replace('am', ' am').replace('pm', ' pm'));
  var cal = new ics();

  cal.addEvent(event.title, description, event.room_color + ' room', beginF, endF);
  cal.download(event.title);*/
}

// TODO: improve event description card
function buildEventDescription(data) {
  var title = data.title ? data.title : ' ';
  var description = data.description ? data.description : ' ';
  var speaker = data.speaker ? data.speaker : ' ';
  var room_color = data.room_color ? data.room_color : ' ';
  var desc = `
    Topic: ${title}\\n
    Description: ${description}\\n
    Speaker: ${speaker}\\n
    Room: ${room_color}\\n
  `
  return desc;
}

function search_sessions() {
  $('#search_sessions').keyup(function(d) {
    var searchText = this.value;
    // if user types in 3 characters or more - match on 'description', 'title', 'speaker'
    //   to filter out correct events
    if (searchText && searchText.length > 0) {
      var trimmedText = searchText.trim().toLowerCase();
      data = sessions.filter(function(e) {
        return e.description.toLowerCase().indexOf(trimmedText) > -1 ||
          e.title.toLowerCase().indexOf(trimmedText) > -1 ||
          e.tags.toLowerCase().indexOf(trimmedText) > -1 ||
          e.speaker.toLowerCase().indexOf(trimmedText) > -1;
      });
      loadCards(data);
      // TODO: revisit 'highlighting' at some point
      // highlight(trimmedText)
      // $('.description').highlight(trimmedText);
    } else {
      loadCards(sessions); // return all events

    }
  });
}

// TODO: fix this method. it highlights text that is being searched
function highlight(text) {
  var src_str = $("#demo").html();
  var term = text;
  term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
  var pattern = new RegExp("("+term+")", "gi");

  src_str = src_str.replace(pattern, "<mark>$1</mark>");
  src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");

  $("#demo").html(src_str);
}

// TODO: refactor this to be more efficient
function getSponsors(data) {
  // create array of unique color/sponsor combo

  this.values = []

  this.colors = [];
  this.sponsors = []

  this.values.push({
    "color": "all",
    "sponsor": "all"
  });
  data.forEach(function(d) {
    if (this.colors.indexOf(d.room_color) === -1 && 
      this.sponsors.indexOf(d.room_sponsor) === -1) {
      this.colors.push(d.room_color);
      this.sponsors.push(d.room_sponsor);
      this.values.push({
        color: d.room_color,
        sponsor: d.room_sponsor
      });
    }
  });
  return this.values;
}
