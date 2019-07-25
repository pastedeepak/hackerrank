'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('bookApp', function() {


  it('should automatically redirect to /book/list', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/book/list");
  });


  describe('Book List', function() {

    beforeEach(function() {
      browser.get('index.html#/book/list');
    });


    it('should render book/list when user navigates to #/book/list', function() {
      expect(element.all(by.css('[ng-view] .jumbotron>h1')).first().getText()).
        toMatch(/Books Directory/);
    });

  });

});

