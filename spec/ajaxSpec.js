(function(window){
  'use strict';

  /**
   * TODO:
   * Test to see if .send() and .open() are called with correct arguments
   * Test if _xhrComplete() is called
   * Test that _xhrComplete() works as expected. Consider the following example:
   * philipwalton.com/articles/how-to-unit-test-private-functions-in-javascript
   */

  var zeplin = window.zeplin,
      mockUrl = '/another/url';

  describe('ajax', function () {
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function(){
      jasmine.Ajax.uninstall();
    });

    // Ajax requires a URL at the ver least.
    it('requires at URL string otherwise fails gracefully', function() {
      expect(function(){
        zeplin.ajax()
      }).toThrow(
        new Error('Please supply a URL to the ajax method.')
      );
    });

    // The GET method should be called by default
    it('is called with only a URL & uses GET by default', function() {
      var mockAjax = spyOn(zeplin, 'ajax');

      mockAjax({url: mockUrl });

      expect(mockAjax.calls.count()).toBe(1);
      expect(mockAjax.calls.argsFor(0)[0]).toEqual({url: mockUrl});

      mockAjax.and.callThrough();
      mockAjax({ url: mockUrl });

      expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

    });

    it('uses POST method if body params are sent in request', function() {
      var mockAjax = spyOn(zeplin, 'ajax');

      mockAjax.and.callThrough();
      mockAjax({url: mockUrl });

      expect(mockAjax.calls.argsFor(0)[0].body).toEqual(undefined);
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

      mockAjax({
        url: mockUrl,
        body: 'color=red&size=14'
      });

      expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
    });

    // If a request method is passed in lets make sure we use it.
    it('uses passed in request method and formats to uppercase', function() {
      zeplin.ajax({
        url: '/some/url',
        method: 'post'
      });

      expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');

      zeplin.ajax({
        url: mockUrl,
        method: 'delete'
      });

      expect(jasmine.Ajax.requests.mostRecent().method).toBe('DELETE');
    });

    // Sets the default request headers for the AJAX request
    it('sets the default request headers', function() {
      zeplin.ajax({url: mockUrl});

      expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded'
      });
    });

    it('sets users specific request headers', function() {
      zeplin.ajax({
        url: mockUrl,
        headers: {
          'Zeplin-Header': 'Zeplin-AJAX-Request'
        }
      });

      expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual(
        jasmine.objectContaining({
          'Zeplin-Header': 'Zeplin-AJAX-Request'
        })
      );

    });


  });
})(window);
