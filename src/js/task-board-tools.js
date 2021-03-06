$(document).ready(function () {

    $('#board-menu-open, #board-menu-close').on('click', function () {
        $('#board-menu').toggle(200);
        $( "div.board-wrapper" ).toggleClass( "is-show-menu");

        return false;
    });

    // Process events from descendant elements that are added to the document at a later time, the cards.
    $("#surface").on("click", ".list-card .toggle-head", function(event){
        $(this).next(".toggle-body").toggle(0, function () {
            // Animation complete.
        });
    });

    $("#filterForm").submit(function(e){
        return false;
    });
    
});