// var encoder = new TextEncoder(); no encoder in Photoshop JSX
// var euro = encoder.encode('€');
var fileStr = new String("");

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

    var exportInfo = new Object();
    initExportInfo(exportInfo);

    if (DialogModes.ALL == app.playbackDisplayDialogs) {
        if (cancelButtonID == settingDialog(exportInfo)) {
            return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
        }
    }

    var docRef = app.activeDocument;

    var layerCount = docRef.layers.length;
    var layerSetsCount = docRef.layerSets.length;
    alert("layerCount: " + layerCount + "\nlayerSetsCount: " + layerSetsCount);

    if ((layerCount <= 1) && (layerSetsCount <= 0)) {
        if (DialogModes.NO != app.playbackDisplayDialogs) {
            return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
        }
    }
    else {
        var destination; var tmp; var fileName
        // try {
        //     // destination = Folder(app.activeDocument.fullName.parent).fsName; // destination folder
        //     // tmp = app.activeDocument.fullName.name;
        //     // fileName = app.activeDocument.name; // filename body part
        // } catch (someError) {
        //     alert("destination wrong or filename wrong");
        //     return 'cancel';
        // }
        // var blob = new Blob();
        var file = File(exportInfo.destination);
        alert(exportInfo.destination);

        recursiveLayers(0, docRef);
        //file.encoding = "GB2312";
        file.open("wb");
        file.write(fileStr);
        file.close();
        alert("successful");
    }
}

function initExportInfo(exportInfo) {
    exportInfo.destination = new String("");
    try {
        var originalFolder = Folder(app.activeDocument.fullName).fsName; // destination folder
        exportInfo.destination = originalFolder + "_layers.txt"; // filename
    } catch (someError) {
        exportInfo.destination = new String("");
    }
}

function settingDialog(exportInfo) {
    dlgMain = new Window("dialog", "export layers' name to files");

    // match our dialog background color to the host application
    var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
    dlgMain.graphics.backgroundColor = brush;
    dlgMain.graphics.disabledBackgroundColor = dlgMain.graphics.backgroundColor;

    dlgMain.orientation = 'column';
    dlgMain.alignChildren = 'left';

    // -- top of the dialog, first line
    dlgMain.add("statictext", undefined, "Destination");

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

    dlgMain.etDestination = dlgMain.grpSecondLine.add("edittext", undefined, exportInfo.destination.toString());
    dlgMain.etDestination.preferredSize.width = StrToIntWithDefault("stretDestination", 160);

    dlgMain.btnBrowse = dlgMain.grpSecondLine.add("button", undefined, strButtonBrowse);
    dlgMain.btnBrowse.onClick = btnBrowseOnClick;
    /* function () {
        var defaultFile = dlgMain.etDestination.text;
        var testFile = new File(dlgMain.etDestination.text);
        var selFile = File.selectDialog(strTitleSelectDestination, defaultFile);
        if (selFile != null) {
            dlgMain.etDestination.text = selFile.fsName;
        }
        dlgMain.defaultElement.active = true;
    } */

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
    exportInfo.destination = dlgMain.etDestination.text;
    var txt = ".txt";
    if ((exportInfo.destination.length - txt.length) != exportInfo.destination.toLowerCase().lastIndexOf(txt)) {
        exportInfo.destination += txt; // add ".pdf" if there is no PDF extension
    }
    
    return result;
}

function recursiveLayers(level, Obj) {
    var layers = Obj.layers;
    var layerLevelName = "";
    for (i = 0; i < level; i++) {
        layerLevelName += "  "; // indent
    }

    if (layers !== undefined) {
        // alert(new String(layers.length))
        for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
            var layerRef = layers[layerIndex];
            var layerName = layerLevelName + layerRef.name;
            layerName = layerName.replace(/[:\/\\*\?\"\<\>\|\\\r\\\n]/g, "_");  // '/\:*?"<>|\r\n' -> '_'
            if (layerName.length > 120)
                layerName = layerName.substring(0, 120);
            fileStr += layerName + "\n";
            recursiveLayers(level + 1, layerRef); // visit it
        }
    }
    return;
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
function btnBrowseOnClick()
{
    var selFile = File.saveDialog(strTitleSelectDestination);
    if ( selFile != null ) {
        dlgMain.etDestination.text = selFile.fsName;
    }
	dlgMain.defaultElement.active = true;
    return;
}

main();
