(function (window) {

    var general = function () {
        if (!(this instanceof general)) {
            return new general();
        }
    };

    general.fn = general.prototype = {

    };

    general.fn.timeouts = {

    };

    general.fn.intervals = {

    };

    general.fn.utilities = {

        check: {

            started: function (match) {

                if (match.status && match.status() != 'upcoming') {
                    return true;
                }

                return false;

            },

            paused: function (match) {

                if (match.live.status) {
                    if (match.live.status().search('pause') !== -1) {
                        return true;
                    }
                }

                return false;

            }

        },

        format: {

            tv_time: function (string) {

                var date = new Date(string);
                var hours = date.getHours().toString();
                var minutes = date.getMinutes().toString();

                if (hours.length === 1) {
                    hours = '0' + hours;
                }

                if (minutes.length === 1) {
                    minutes = '0' + minutes;
                }

                return hours + ':' + minutes;

            },

            date: function (match) {

                var date = new Date(match.date());
                var hours = date.getHours().toString();
                var minutes = date.getMinutes().toString();

                if (hours.length === 1) {
                    hours = '0' + hours;
                }

                if (minutes.length === 1) {
                    minutes = '0' + minutes;
                }

                return hours + ':' + minutes;

            },

            time: function (match) {

                var string = '';
                var status = 'not_started';
                var segment = '';
                var sport = match.sport.id();
                var time = null;

                if (match.live && match.live.status) {
                    status = match.live.status();
                }

                if (match.live && match.live.time) {
                    time = match.live.time();
                }

                if (match.live && match.live.segment && match.live.segment.abbr) {
                    segment = match.live.segment.abbr();
                }

                if (status == 'not_started') {
                    string = general.utilities.format.date(match)
                }
                else if (status == 'interrupted' || status == 'ended' || status == 'walkover' || status == 'retired') {
                    string = segment;
                }
                else {

                    if (general.utilities.check.paused(match)) {

                        // Soccer, Basketball, Handball
                        if (sport == '1' || sport == '2' || sport == '6') {

                            // Basketball
                            if (sport == '2' && status != 'pause2') {
                                string = '<span class="lines"></span>';
                            }
                            else {
                                string = segment;
                            }

                        }
                        else {
                            string = '<span class="lines"></span>';
                        }

                    }
                    else {

                        if (time) {
                            string = time + '\'';
                        }
                        else {
                            string = status;
                        }

                    }

                }

                return string;

            },

            setscores: function (match) {

                var status = 'not_started';
                var setscores = '';
                var score = '';

                if (typeof match.live.status == 'function') {
                    status = match.live.status();
                }

                if ((match.sport.id() == 1 || match.sport.id() == 6) && (status == '2p' || status == 'paused')) {
                    return setscores;
                }

                if (typeof match.live.score == 'function') {
                    score = match.live.score();
                }

                if (typeof match.live.setscores != 'function') {
                    return setscores;
                }

                setscores = match.live.setscores().join(' ');

                if (match.sport.id() == 2 || match.sport.id() == 4) {

                    if (score != '-:-') {
                        return setscores + ' ' + score;
                    }

                }

                return setscores;

            },

            timeline: function (match) {

                var timeline = [];

                if (typeof match.timeline != 'function') {
                    return timeline;
                }

                var items = match.timeline();

                for (var i = 0; i < items.length; i++) {

                    var item = items[i];
                    var type = item.type();

                    if (type == 'score' || type == 'card') {
                        timeline.push(item);
                    }

                }

                return timeline;

            },

            segment: function (match) {

                if (!match.live) {
                    return '';
                }

                if (typeof match.live.status != 'function') {
                    return '';
                }

                if (typeof match.live.segment != 'object') {
                    return '';
                }

                if (typeof match.live.segment.name != 'function') {
                    return '';
                }

                var status = match.live.status();
                var segment = match.live.segment.name();
                var sport = match.sport.id();

                if (status == 'not_started') {
                    return '';
                }
                else if (status == 'paused' && (sport == 1 || sport == 6)) {
                    return '';
                }
                else if (status == '2p' && (sport == 1 || sport == 6)) {
                    return '';
                }
                else {
                    return segment;
                }

            }

        }

    };

    general.fn.helpers = {

        ticket: {

            removeBorders: function () {

                if (typeof general.timeouts.ticket != 'undefined') {
                    clearTimeout(general.timeouts.ticket);
                    delete general.timeouts.ticket;
                }

                general.timeouts.ticket = setTimeout(function () {
                    $('.event_num').removeClass('color1').removeClass('color2');
                }, 3000);

            }

        },

        matches: {

            removeScoreChanges: function(match) {


                if ($('.score-home.changed[data-match="' + match + '"]').length > 0) {

                    setTimeout(function () {
                        $('.score-home[data-match="' + match + '"]').removeClass('changed');
                    }, 15000);

                }

                if ($('.score-away.changed[data-match="' + match + '"]').length > 0) {

                    setTimeout(function () {
                        $('.score-away[data-match="' + match + '"]').removeClass('changed');
                    }, 15000);

                }

            },

            removeBorders: function (match) {

                setTimeout(function () {
                    $('.btn[data-match="' + match + '"]').removeClass('color1').removeClass('color2');
                }, 3000);

            },

            removeAllBorders: function (delay) {

                if (typeof delay == 'number') {
                    setTimeout(function () {
                        $('.btn.color1').removeClass('color1');
                        $('.btn.color2').removeClass('color2');
                    }, delay);
                }
                else {
                    $('.btn.color1').removeClass('color1');
                    $('.btn.color2').removeClass('color2');
                }

            },

            live: {

                bets: function (sport, match) {

                    if (sport == 1) {

                        return betmatic.products.betting.matches.findOdds(match, [
                            { type: '10' },
                            { type: 'ft3w', subtype: '4' },
                            { type: 'ft3w', subtype: '13' },
                            { type: 'to'},
                            { type: 'ft3w', subtype: '8' },
                            { type: 'ft3w', subtype: '14' },
                            { type: 'ft2w', subtype: '7' }
                        ]);

                    } else if (sport == 2) {

                        return betmatic.products.betting.matches.findOdds(match, [
                            { type: '20' },
                            { type: 'ft2w', subtype: '37' },
                            { type: 'to' }
                        ]);

                    } else if (sport == 4) {

                        return betmatic.products.betting.matches.findOdds(match, [
                            { type: '10' },
                            { type: '3w' },
                            { type: 'ft3w', subtype: '13' },
                            { type: 'to' }
                        ]);

                    } else if (sport == 5) {

                        return betmatic.products.betting.matches.findOdds(match, [
                            { type: '20' },
                            { type: 'ft2w', subtype: '10' },
                            { type: 'ft2w', subtype: '11' },
                            { type: 'ftnw', subtype: '83' }
                        ]);

                    } else if (sport == 6) {

                        return betmatic.products.betting.matches.findOdds(match, [
                            { type: '10' },
                            { type: '3w' },
                            { type: 'hc' },
                            { type: 'to' }
                        ]);

                    } else if (sport == 23) {

                        return betmatic.products.betting.matches.findOdds(match, [
                            { type: '20' },
                            { type: 'ft2w', subtype: '102' },
                            { type: 'ft2w', subtype: '103' },
                            { type: 'to'}
                        ]);

                    } else if (sport == 34) {

                        return betmatic.products.betting.matches.findOdds(match, [
                            { type: '20' },
                            { type: 'ft2w', subtype: '102' },
                            { type: 'ft2w', subtype: '103' },
                            { type: 'to' }
                        ]);

                    }

                }

            }

        }

    };

    general.fn.parse = function () {

        $('button[data-redirect]').unbind('click').bind('click', function () {
            betmatic.redirect($(this).attr('data-redirect'));
        });

        $('button[data-ticket]').unbind('click').bind('click', function () {

            var element = $(this);
            var action = element.attr('data-ticket');

            if (action == 'add') {

                element.attr('data-ticket', 'remove');
                element.addClass('active');

                betmatic.products.betting.ticket.add({
                    match: element.attr('data-match'),
                    outright: element.attr('data-outright'),
                    type: element.attr('data-type'),
                    subtype: element.attr('data-subtype'),
                    outcome: element.attr('data-outcome'),
                    special: element.attr('data-special'),
                    live: element.attr('data-live')
                }, function (ticket) {

                    if (ticket.success() != true) {
                        element.attr('data-ticket', 'add');
                        element.removeClass('active');
                    }

                });

            }
            else if (action == 'remove') {

                element.attr('data-ticket', 'add');
                element.removeClass('active');

                betmatic.products.betting.ticket.remove({
                    match: element.attr('data-match'),
                    outright: element.attr('data-outright'),
                    type: element.attr('data-type'),
                    subtype: element.attr('data-subtype'),
                    outcome: element.attr('data-outcome'),
                    special: element.attr('data-special'),
                    live: element.attr('data-live')
                }, function (ticket) {

                    if (ticket.success() != true) {
                        element.attr('data-ticket', 'remove');
                        element.addClass('active');
                    }

                });

            }
            else if (action == 'set') {

                var variable = element.attr('data-variable');
                var value = element.attr('data-value');

                betmatic.products.betting.ticket.set(variable, value, function () {

                });

            }
            else if (action == 'clear') {

                betmatic.products.betting.ticket.clear(function (ticket) {

                    if (ticket.success() == true) {

                        $('button[data-ticket="remove"]').each(function (index, el) {
                            $(el).attr('data-ticket', 'add');
                            $(el).removeClass('active');
                        });

                    }

                });

            }
            else if (action == 'purge') {

                element.attr('disabled', 'disabled');

                betmatic.products.betting.ticket.purge(function (ticket) {

                    element.removeAttr('disabled');

                });

            }
            else if (action == 'purchase') {

                element.attr('disabled', 'disabled');

                betmatic.products.betting.ticket.purchase(function (ticket) {

                    if (ticket.success() == true) {

                        $('button[data-ticket="remove"]').each(function (index, el) {
                            $(el).attr('data-ticket', 'add');
                            $(el).removeClass('active');
                        });

                    }

                    element.removeAttr('disabled');

                });

            }

        });

    }

    window.general = general = general();

})(window);

$(document).ready(function () {

    betmatic.idle.on('inactive', function () {
        $('#timeout').popup('open');
    });

    betmatic.socket.on('reconnect', function () {
        betmatic.products.betting.matches.refresh();
    });

    betmatic.socket.on('disconnect', function () {
        $('.btn[data-ticket][data-started="true"]').attr('disabled', 'disabled');
    });

    betmatic.socket.on('execute', function (event, action, params) {

        if (action == 'CUSTOMER_BALANCE_CHANGED') {
            $('#customer-balance').each(function (index, element) {
                ko.applyBindings(ko.mapping.fromJS(params), element);
            });
        }
        else if (action == 'BETTING_LIVE_BETSTART') {
            general.parse();
        }
        else if (action == 'BETTING_LIVE_BETSTOP') {
            general.parse();
        }
        else if (action == 'BETTING_LIVE_CHANGED') {
            general.parse();
        }
        else if (action == 'BETTING_LIVE_PING') {
            general.parse();
        }

    });

    betmatic.products.betting.matches.on('insert', function () {
        general.helpers.matches.removeAllBorders(1000);
    });

    betmatic.products.betting.matches.on('update', function (event, store, match) {

        general.parse();

        if (typeof match == 'object' && typeof match.id == 'function') {
            general.helpers.matches.removeBorders(match.id());
            general.helpers.matches.removeScoreChanges(match.id());
        }

    });

    betmatic.products.betting.ticket.on('update', function (event, success, data) {

        general.parse();

    });

    betmatic.products.betting.ticket.on('purchase', function (event, success, data) {

        if (success == true) {
            setTimeout(function () {
                $('#ticket-accepted').popup('open');
            }, 1000);
        }

    });

    betmatic.products.betting.ticket.loader.on('start', function () {

        $('#ticket-loader').popup('open');

    });

    betmatic.products.betting.ticket.loader.on('update', function (event, percent) {

        $('#ticket-loader .bar').width(percent + '%');

        if (percent >= 100) {
            setTimeout(function () {
                $('#ticket-loader').popup('close');
                $('#ticket-loader .bar').width('0%');
            }, 1000);
        }

    });

    general.parse();


    if((/iphone|ipod|ipad/gi).test(navigator.platform)){
        if (!('standalone' in navigator) || navigator.standalone) {
            var a=document.getElementsByTagName("a");
            for(var i=0;i<a.length;i++) {
                if(!a[i].onclick && a[i].getAttribute("target") != "_blank" && a[i].getAttribute("data-rel") != 'back') {
                    a[i].onclick=function(e) {
                            event.preventDefault();
                            window.location=this.getAttribute("href");
                            return false; 
                    }
                }
            }
        }
    }    
});