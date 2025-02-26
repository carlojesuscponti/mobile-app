package com.bulsupc;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.yonahforst.rnpermissions.RNPermissionsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rumax.reactnative.pdfviewer.PDFViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
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
					new WebViewBridgePackage(),
					new PDFViewPackage(),
					new ReactNativeDocumentPicker(),
					new RNFetchBlobPackage(),
					new RNPermissionsPackage(),
					new SvgPackage()
      );
    }

	@Override
	public List<ReactPackage> createAdditionalReactPackages() {
		return getPackages();
	}
}