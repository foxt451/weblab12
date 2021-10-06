import { addData } from '/scripts/statsFunctions.js';

const submitForm = {
    getFormData: function () {
        var parts = window.location.search.substr(1).split("&");
        var $_GET = {};
        for (var i = 0; i < parts.length; i++) {
            var temp = parts[i].split("=");
            if (!(decodeURIComponent(temp[0]) in $_GET))
            {
                $_GET[decodeURIComponent(temp[0])] = {};
            }
            const value = decodeURIComponent(temp[1])
            $_GET[decodeURIComponent(temp[0])][value] = true;
        }
        const data = 
        {
            mainlang: $_GET['mainlang'],
            usedlang: $_GET['usedlang'],
            color: $_GET['color'],
            firstProg: $_GET['firstProg']
        };
        return data;
    },
    submitData: function () {
        return addData(this.getFormData()).then(function (response) { console.log(response); }).
            catch(function (err) {
                console.log(err);
            });
    }
};

submitForm.submitData().then((result) => history.go(-1));


