const domManipulations = {
    switchContentsOf: function (id1, id2) {
        let item1 = document.getElementById(id1);
        let item2 = document.getElementById(id2);
        [item1.innerHTML, item2.innerHTML] = [item2.innerHTML, item1.innerHTML];
    }
}
