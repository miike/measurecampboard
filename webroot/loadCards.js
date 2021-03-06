function loadCards(data) {
  if (!data) {
    return;
  }
  divs = `<div class="ui five stackable cards">`;
  for (x in data) {
    var session = data[x];
    var room_color = session.room_color ? session.room_color : '&#160;',
      room_sponsor = session.room_sponsor ? session.room_sponsor : '&#160;',
      time = session.time ? session.time.replace(/am/ig, '').replace(/pm/ig, '').trim() : '&#160;',
      title = session.title ? session.title : '&#160;',
      description = session.description ? session.description : '&#160;',
      twitter = session.twitter ?
        '<a title="' + session.twitter + '" target="_blank" href="https://www.twitter.com/' +
          session.twitter + '"><i class="twitter icon"></i>' + session.speaker + '</a>' :
        undefined,
      speaker = twitter ?
        twitter :
        session.speaker ? session.speaker : '<i title="Anonymous Coward" class="user secret icon"></i>',
      tags = session.tags ? session.tags : 'N/A',
      focus = session.focus === 'B' ? 'Business'   : session.focus === 'T' ? 'Technical' : '&#160;',
      level = session.level === 'N' ? 'Beginner'   : session.level ===  'A' ? 'Advanced' : '&#160;',
      type = session.type === 'P' ? 'Presentation' : session.type === 'D' ? 'Discussion' : '&#160;',
      av = session.av === 'AV' ?
        '<i title="Audio/Video" class="large file audio outline icon"></i>' :
        '<i title="Whiteboard only" class="large clipboard outline icon"></i>',
      capacity = session.capacity ? session.capacity : 'N/A';
    var jsonSession = JSON.stringify(session).toString();
    var dataId = session['data-id'];
    var tagsHtml = buildTags(tags);
    // TODO: refactor into more modular/readable code
    var sessionSelect = '';
    var outline = 'outline';
    var cardSaved = localStorage.getItem('card' + dataId);
    if (cardSaved === 'true' || cardSaved === true) {
      sessionSelect = 'session-select';
    }
    session['session-select'] = cardSaved;
    if (description === '&#160;') {
      // divs += buildSingleEmptyCard(this);
      divs += `
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
    } else if (room_color == 'custom') { // if `room_color` == custom - this is custom card (for example happy hour, lunch, etc)
      // divs += buildCustomCard();
      divs += `
        <div class="card ${dataId} ${sessionSelect} full-width-card" data-id="${dataId}">
          <div class="content">
            <h5 class="ui ${room_color} header">
              <span class="session-time-header">${time}</span>
            </h5>
            <div class="left aligned card-header">
              ${title}
            </div>
            <div class="description">
              ${description}
            </div>
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
    } else {
      divs += `
        <div class="card ${dataId} ${sessionSelect}" data-id="${dataId}">
          <div class="content">
            <h5 class="ui ${room_color} header">
              <span class="session-time-header">${time}</span>
              <div class="ui basic label speaker-twitter">
                ${speaker}
              </div>
              <span class="heart-right">
                <i title="Add to Calendar" class="${room_color} heart ${outline} icon add-to-call" onclick="addToCall(${dataId}, this)"></i>
              </span>
            </h5>
            <div class="left aligned card-header">
              ${title}
            </div>
            <span class="tag-labels">${level} | </span>
            <span class="tag-labels">${focus} | </span>
            <span class="tag-labels">${type}</span>

            <div class="description">
              ${description}
            </div>

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
  }

  divs += `</div>`;
  divs += `
    <button class="ui basic button built-by"
        title="https://www.linkedin.com/in/vitaliymatiyash/"
        onclick="window.open('https://www.linkedin.com/in/vitaliymatiyash/',  '_blank')">
      Built by Vitaliy Matiyash
    </button>
    `;
  document.getElementById("demo").innerHTML = divs;
  // $('.calendar.plus.outline.icon.right.floated')
}

// Build links in top left dropdown menu
// This reads from `gOptions.links` array
function getLinks() {
  var div = '';
  div += `
  <div class="ui simple dropdown">
    <div class="text">Links</div>
    <i class="dropdown icon"></i>
    <div class="menu">
  `;
  if (gOptions.enabled) {
    for (var link in gOptions.links) {
      var item = gOptions.links[link];
      div += `
        <a class="item" target="_blank" title="${item.title}" href="${item.href}">
          ${item.text}
        </a>
      `;
    }
  }
  div += `</div></div>`;
  document.getElementById("linksDropdown").innerHTML = div;
}
