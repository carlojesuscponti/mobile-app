package com.bulsupc;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import ui.fileselector.RNFileSelectorPackage;
import com.rumax.reactnative.pdfviewer.PDFViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.filepicker.FilePickerPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
//import com.reactnativenavigation.bridge.NavigationReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  @Override
	public boolean isDebug() {
		// Make sure you are using BuildConfig from your own application
		return BuildConfig.DEBUG;
	}

	protected List<ReactPackage> getPackages() {
		return Arrays.<ReactPackage>asList(
          new VectorIconsPackage(),
					new ImagePickerPackage(),
					new FilePickerPackage(),
					new WebViewBridgePackage(),
					new PDFViewPackage(),
					new ReactNativeDocumentPicker(),
					new RNFileSelectorPackage(),
					new RNFetchBlobPackage()
      );
    }

	@Override
	public List<ReactPackage> createAdditionalReactPackages() {
		return getPackages();
	}
}