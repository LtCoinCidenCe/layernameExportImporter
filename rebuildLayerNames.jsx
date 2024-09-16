var strButtonRun = localize("$$$/JavaScripts/ExportLayersToFiles/Run=Run");
var strButtonBrowse = localize("$$$/JavaScripts/ExportLayersToFiles/Browse=&Browse...");
var strTitleSelectDestination = localize("$$$/JavaScripts/ExportLayersToFiles/SelectDestination=Select Destination");
var strButtonCancel = localize("$$$/JavaScripts/ExportLayersToFiles/Cancel=Cancel");

// ok and cancel button
var runButtonID = 1;
var cancelButtonID = 2;

function main() {
    if (app.documents.length <= 0) {
        alert("DocumentMustBeOpened");
        return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
    }

    var importInfo = new Object();
    initImportInfo(importInfo);

    if (DialogModes.ALL == app.playbackDisplayDialogs) {
        if (cancelButtonID == settingDialog(importInfo)) {
            return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
        }
    }

    alert(importInfo.destination);

    var docRef = app.activeDocument;

    var layerCount = docRef.layers.length;
    var layerSetsCount = docRef.layerSets.length;
    if ((layerCount <= 1) && (layerSetsCount <= 0)) {
        if (DialogModes.NO != app.playbackDisplayDialogs) {
            return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
        }
    }
    else {
        var file = File(importInfo.destination);
        file.encoding = 'shift-jis'; // comment this line if you modify the encoding by yourself
        file.open("r");
        var strctText = file.read();
        file.close();
        var lines = strctText.split("\n");
        //alert(lines.length);
        recursiveLayers(0, docRef, lines);
    }
    alert("successful");
}

function initImportInfo(importInfo) {
    importInfo.destination = new String("");
}

function settingDialog(importInfo) {
    dlgMain = new Window("dialog", "import layers' names");
    // match our dialog background color to the host application
    var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
    dlgMain.graphics.backgroundColor = brush;
    dlgMain.graphics.disabledBackgroundColor = dlgMain.graphics.backgroundColor;

    dlgMain.orientation = 'column';
    dlgMain.alignChildren = 'left';

    // -- top of the dialog, first line
    dlgMain.add("statictext", undefined, "Good text file");

    // -- two groups, one for left and one for right ok, cancel
    dlgMain.grpTop = dlgMain.add("group");
    dlgMain.grpTop.orientation = 'row';
    dlgMain.grpTop.alignChildren = 'top';
    dlgMain.grpTop.alignment = 'fill';

    // -- group top left 
    dlgMain.grpTopLeft = dlgMain.grpTop.add("group");
    dlgMain.grpTopLeft.orientation = 'column';
    dlgMain.grpTopLeft.alignChildren = 'left';
    dlgMain.grpTopLeft.alignment = 'fill';

    // -- the second line in the dialog
    dlgMain.grpSecondLine = dlgMain.grpTopLeft.add("group");
    dlgMain.grpSecondLine.orientation = 'row';
    dlgMain.grpSecondLine.alignChildren = 'center';

    dlgMain.etDestination = dlgMain.grpSecondLine.add("edittext", undefined, importInfo.destination.toString());
    dlgMain.etDestination.preferredSize.width = StrToIntWithDefault("stretDestination", 160);

    dlgMain.btnBrowse = dlgMain.grpSecondLine.add("button", undefined, strButtonBrowse);
    dlgMain.btnBrowse.onClick = btnBrowseOnClick;

    // the right side of the dialog, the ok and cancel buttons
    dlgMain.grpTopRight = dlgMain.grpTop.add("group");
    dlgMain.grpTopRight.orientation = 'column';
    dlgMain.grpTopRight.alignChildren = 'fill';

    dlgMain.btnRun = dlgMain.grpTopRight.add("button", undefined, strButtonRun);

    dlgMain.btnRun.onClick = function () {
        // check if the setting is properly
        var destination = dlgMain.etDestination.text;
        if (destination.length == 0) {
            alert("strAlertSpecifyDestination");
            return;
        }
        // var testFolder = new Folder(destination);
        // if (!testFolder.exists) {
        //     alert(strAlertDestinationNotExist);
        //     return;
        // }

        dlgMain.close(runButtonID);
    }

    dlgMain.btnCancel = dlgMain.grpTopRight.add("button", undefined, strButtonCancel);

    dlgMain.btnCancel.onClick = function () {
        dlgMain.close(cancelButtonID);
    }

    dlgMain.defaultElement = dlgMain.btnRun;
    dlgMain.cancelElement = dlgMain.btnCancel;


    dlgMain.onShow = function () {
        dlgMain.ddFileType.onChange();
    }

    // give the hosting app the focus before showing the dialog
    app.bringToFront();

    dlgMain.center();

    var result = dlgMain.show();

    if (cancelButtonID == result) {
        return result;  // close to quit
    }

    // get setting from dialog
    importInfo.destination = dlgMain.etDestination.text;

    return result;
}

///////////////////////////////////////////////////////////////////////////
// Function: StrToIntWithDefault
// Usage: convert a string to a number, first stripping all characters
// Input: string and a default number
// Return: a number
///////////////////////////////////////////////////////////////////////////
function StrToIntWithDefault(s, n) {
    var onlyNumbers = /[^0-9]/g;
    var t = s.replace(onlyNumbers, "");
    t = parseInt(t);
    if (!isNaN(t)) {
        n = t;
    }
    return n;
}

///////////////////////////////////////////////////////////////////////////////
// Function: btnBrowseOnClick
// Usage: routine is assigned to the onClick method of the browse button
// Input: pop the selectDialog, and get a folder
// Return: <none>, sets the destination edit text
///////////////////////////////////////////////////////////////////////////////
function btnBrowseOnClick() {
    var selFile = File.saveDialog(strTitleSelectDestination);
    if (selFile != null) {
        dlgMain.etDestination.text = selFile.fsName;
    }
    dlgMain.defaultElement.active = true;
    return;
}

var liner = 0;
function recursiveLayers(level, Obj, lines) {
    var layers = Obj.layers;
    if (layers !== undefined) {
        for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
            var layerRef = layers[layerIndex];

            var mataNoreplacableText = lines[liner];
            // level check
            for (var i = 0; i < level * 2; i++) {
                if (!(mataNoreplacableText[i] === " ")) {
                    alert("level does not match");
                }
            }

            var replaceableText = mataNoreplacableText.substring(level * 2);
            layerRef.name = replaceableText;
            liner += 1;
            recursiveLayers(level + 1, layerRef, lines); // visit it
        }
    }
    return;
}

main();
