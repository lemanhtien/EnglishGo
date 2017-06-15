//
//  ObjectRecognitionVC.swift
//  EnglishGo
//
//  Created by Martin Lee on 6/15/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit
import AVFoundation
import CNPPopupController
import NVActivityIndicatorView
import Alamofire
import Lottie
import LTMorphingLabel
import Kingfisher
import SnapKit
import FaveButton

let SERVER_URL = "http://office.orm.vn:1002/detectobject"

struct MTObject {
  var name: String
  var x: Double
  var y: Double
  var width: Double
  var height: Double
  var accuracy: Double
}

struct Vocab {
  var word: String
  var image1: UIImage
  var image2: UIImage
  var image3: UIImage
  
}

struct FlashCard {
  var word: String?
  var image: UIImage?
}

struct Lesson {
  var vocabs: [Vocab]
}

enum ObjectMode {
  case normal
  case exam
}

class ObjectRecognitionVC: UIViewController {
  
  var mode: ObjectMode = .exam
  
  var session: AVCaptureSession!
  var previewLayer: AVCaptureVideoPreviewLayer!
  let stillImageOutput = AVCaptureStillImageOutput()
  var readyTakePicture = false
  var btnTakePicture: UIButton = {
    var btn = UIButton.init()
    //        btn .setTitle("Click", for: .normal)
    btn.setImage(#imageLiteral(resourceName: "takepicture"), for: .normal)
    btn.addTarget(self, action: #selector(btnTakePictureClicked(_:)), for: .touchUpInside)
    return btn
  }()
  var collectionView: UICollectionView = {
    let layout = UICollectionViewFlowLayout.init()
    layout.sectionInset = UIEdgeInsets.init(top: 8, left: 8, bottom: 8, right: 8)
    layout.itemSize = CGSize.init(width: 80, height: 80)
    layout.scrollDirection = UICollectionViewScrollDirection.horizontal
    
    let collectionview = UICollectionView.init(frame: CGRect.zero, collectionViewLayout: layout)
    collectionview.register(ObjectRegconitionCell.self, forCellWithReuseIdentifier: "ObjectRegconitionCell")
    collectionview.backgroundColor = .clear
    collectionview.showsHorizontalScrollIndicator = false
    return collectionview
  }()
  
  var listObjects: [MTObject] = []
  var listObjectLabels: [UILabel] = []
  var listObjectButtons: [UIButton] = []
  var listURIImage: [String] = []
  var vocab: Vocab? {
    didSet{
      self.titleLabel.text = "Find \(self.vocab?.word.uppercased() ?? "")"
    }
  }
  var lesson: Lesson?
  var currentIndex: Int = 0
  
  var titleLabel: UILabel = {
    let label = UILabel.init()
    label.backgroundColor = .clear
    label.textColor = .white
    label.font = UIFont.systemFont(ofSize: 25.0, weight: 50)
    return label
  }()
  var btnRemove: UIButton = {
    let btn = UIButton.init()
    btn.setImage(#imageLiteral(resourceName: "remove"), for: .normal)
    return btn
  }()
  var activityIndicatorView: NVActivityIndicatorView?
  var device: AVCaptureDevice?
  var loadImagesRequest: DataRequest?
  var popupController:CNPPopupController?
  var btnRemoveAllLabel: UIButton = {
    let btn = UIButton.init()
    return btn
  }()
  
  override func viewDidLoad() {
    super.viewDidLoad()
    self.navigationController?.isNavigationBarHidden = true
    //
    self.view.addSubview(titleLabel)
    titleLabel.snp.makeConstraints { (make) in
      make.centerX.equalTo(self.view)
      make.top.equalTo(self.view).offset(50)
    }
    
    //
    self.view.addSubview(btnRemove)
    btnRemove.snp.makeConstraints { (make) in
      make.trailing.equalTo(self.view.snp.trailing).offset(-18)
      make.top.equalTo(self.view.snp.top).offset(20)
      make.width.height.equalTo(30)
    }
    btnRemove.addTarget(self, action: #selector(handleCloseButtonClicked(_:)), for: .touchUpInside)
    self.view.bringSubview(toFront: btnRemove)
    
    //
    session = AVCaptureSession()
    stillImageOutput.outputSettings = [AVVideoCodecKey:AVVideoCodecJPEG]
    
    //        guard let device = AVCaptureDevice.defaultDevice(
    //            withDeviceType: .builtInWideAngleCamera,
    //            mediaType: AVMediaTypeVideo,
    //            position: .back)
    //            else { fatalError("no front camera. but don't all iOS 10 devices have them?") }
    guard let device = AVCaptureDevice.defaultDevice(withMediaType: AVMediaTypeVideo) else {
      fatalError("no front camera. but don't all iOS 10 devices have them?")
    }
    ////        device.position = .back
    //
    let videoInput: AVCaptureDeviceInput?
    self.device = device
    do {
      videoInput = try AVCaptureDeviceInput(device: device)
    } catch {
      return
    }
    
    session.addInput(videoInput)
    
    let metadataOutput = AVCaptureMetadataOutput()
    session.addOutput(metadataOutput)
    session.addOutput(stillImageOutput)
    
    //        metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
    print(metadataOutput.availableMetadataObjectTypes)
    
    //        metadataOutput.metadataObjectTypes = [AVMetadataObjectTypeFace]
    
    previewLayer = AVCaptureVideoPreviewLayer(session: session);
    previewLayer.frame = view.layer.bounds;
    previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    previewLayer.connection.videoOrientation = .portrait
    
    DispatchQueue.main.async {
      /*
       Why are we dispatching this to the main queue?
       Because AVCaptureVideoPreviewLayer is the backing layer for PreviewView and UIView
       can only be manipulated on the main thread.
       Note: As an exception to the above rule, it is not necessary to serialize video orientation changes
       on the AVCaptureVideoPreviewLayer’s connection with other session manipulation.
       
       Use the status bar orientation as the initial video orientation. Subsequent orientation changes are
       handled by CameraViewController.viewWillTransition(to:with:).
       */
      let statusBarOrientation = UIApplication.shared.statusBarOrientation
      var initialVideoOrientation: AVCaptureVideoOrientation = .portrait
      if statusBarOrientation != .unknown {
        if let videoOrientation = statusBarOrientation.videoOrientation {
          initialVideoOrientation = videoOrientation
        }
      }
      
      self.previewLayer.connection.videoOrientation = initialVideoOrientation
    }
    view.layer.addSublayer(previewLayer);
    // Begin the capture session.
    session.startRunning()
    // Do any additional setup after loading the view, typically from a nib.
    self.view.addSubview(self.btnTakePicture)
    
    self.collectionView.dataSource = self
    self.collectionView.delegate = self
    self.view.addSubview(self.collectionView)
    self.setupConstraint()
    
    self.view.bringSubview(toFront: btnRemove)
    self.view.bringSubview(toFront: titleLabel)
    
    activityIndicatorView = NVActivityIndicatorView(frame: CGRect.init(x: self.view.center.x, y: self.view.center.y, width: 30, height: 30), type: NVActivityIndicatorType(rawValue: 29)!)
    self.view.addSubview(activityIndicatorView!)
    activityIndicatorView?.isHidden = true
    
    if mode == .normal {
      self.view.addSubview(btnRemoveAllLabel)
      btnRemoveAllLabel.snp.makeConstraints({ (make) in
        make.top.leading.equalTo(self.view)
        make.width.height.equalTo(50)
      })
      btnRemoveAllLabel.addTarget(self, action: #selector(removeAllLabel(_:)), for: .touchUpInside)
      self.view.bringSubview(toFront: self.btnRemoveAllLabel)
    }
  }
  
  func removeAllLabel(_ sender: UIButton) {
    print("Remove")
    listObjectLabels.forEach({ $0.removeFromSuperview() })
    listObjectButtons.forEach({ $0.removeFromSuperview() })
    self.listURIImage.removeAll()
    self.collectionView.reloadData()
  }
  
  func setupConstraint() {
    self.btnTakePicture.snp.makeConstraints { (make) in
      make.bottom.equalToSuperview().offset(-100)
      make.centerX.equalToSuperview()
      make.height.width.equalTo(100)
    }
    
    self.collectionView.snp.makeConstraints { (make) in
      make.leading.bottom.trailing.equalTo(self.view)
      make.height.equalTo(100)
    }
  }
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    if (session?.isRunning == false) {
      session.startRunning()
    }
  }
  
  override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    if (session?.isRunning == true) {
      session.stopRunning()
    }
  }
  
  override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
    super.viewWillTransition(to: size, with: coordinator)
    if previewLayer != nil {
      if let videoPreviewLayerConnection = previewLayer.connection {
        let deviceOrientation = UIDevice.current.orientation
        guard let newVideoOrientation = deviceOrientation.videoOrientation, deviceOrientation.isPortrait || deviceOrientation.isLandscape else {
          return
        }
        videoPreviewLayerConnection.videoOrientation = newVideoOrientation
      }
    }
  }
  
  // MARK: Handle TOUCHES
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    let screenSize = self.view.bounds.size
    if let touchPoint = touches.first {
      let x = touchPoint.location(in: self.view).y / screenSize.height
      let y = 1.0 - touchPoint.location(in: self.view).x / screenSize.width
      let focusPoint = CGPoint(x: x, y: y)
      
      if let device = self.device {
        do {
          try device.lockForConfiguration()
          device.focusPointOfInterest = focusPoint
          //device.focusMode = .continuousAutoFocus
          device.focusMode = .autoFocus
          //device.focusMode = .locked
          device.exposurePointOfInterest = focusPoint
          device.exposureMode = AVCaptureExposureMode.continuousAutoExposure
          device.unlockForConfiguration()
        }
        catch {
          // just ignore
        }
      }
    }
  }
  
  class MetadataObjectLayer: CAShapeLayer {
    var metadataObject: AVMetadataObject?
  }
  
  /**
   A dispatch semaphore is used for drawing metadata object overlays so that
   only one group of metadata object overlays is drawn at a time.
   */
  let metadataObjectsOverlayLayersDrawingSemaphore = DispatchSemaphore(value: 1)
  
  var metadataObjectOverlayLayers = [MetadataObjectLayer]()
  
  func createMetadataObjectOverlayWithMetadataObject(_ metadataObject: AVMetadataObject) -> MetadataObjectLayer {
    // Transform the metadata object so the bounds are updated to reflect those of the video preview layer.
    let transformedMetadataObject = previewLayer.transformedMetadataObject(for: metadataObject)
    
    // Create the initial metadata object overlay layer that can be used for either machine readable codes or faces.
    let metadataObjectOverlayLayer = MetadataObjectLayer()
    metadataObjectOverlayLayer.metadataObject = transformedMetadataObject
    metadataObjectOverlayLayer.lineJoin = kCALineJoinRound
    metadataObjectOverlayLayer.lineWidth = 1.0
    metadataObjectOverlayLayer.strokeColor = view.tintColor.withAlphaComponent(0.7).cgColor
    metadataObjectOverlayLayer.fillColor = view.tintColor.withAlphaComponent(0.1).cgColor
    
    if transformedMetadataObject is AVMetadataMachineReadableCodeObject {
      let barcodeMetadataObject = transformedMetadataObject as! AVMetadataMachineReadableCodeObject
      
      let barcodeOverlayPath = barcodeOverlayPathWithCorners(barcodeMetadataObject.corners as! [CFDictionary])
      metadataObjectOverlayLayer.path = barcodeOverlayPath
      
      // If the metadata object has a string value, display it.
      if barcodeMetadataObject.stringValue.characters.count > 0 {
        let barcodeOverlayBoundingBox = barcodeOverlayPath.boundingBox
        
        let textLayer = CATextLayer()
        textLayer.alignmentMode = kCAAlignmentCenter
        textLayer.bounds = CGRect(x: 0.0, y: 0.0, width: barcodeOverlayBoundingBox.size.width, height: barcodeOverlayBoundingBox.size.height)
        textLayer.contentsScale = UIScreen.main.scale
        textLayer.font = UIFont.boldSystemFont(ofSize: 19).fontName as CFString
        textLayer.position = CGPoint(x: barcodeOverlayBoundingBox.midX, y: barcodeOverlayBoundingBox.midY)
        textLayer.string = NSAttributedString(string: barcodeMetadataObject.stringValue, attributes: [
          NSFontAttributeName: UIFont.boldSystemFont(ofSize: 19),
          kCTForegroundColorAttributeName as String: UIColor.white.cgColor,
          kCTStrokeWidthAttributeName as String: -5.0,
          kCTStrokeColorAttributeName as String: UIColor.black.cgColor])
        textLayer.isWrapped = true
        // Invert the effect of transform of the video preview so the text is orientated with the interface orientation.
        textLayer.transform = CATransform3DInvert(CATransform3DMakeAffineTransform(self.view.transform))
        metadataObjectOverlayLayer.addSublayer(textLayer)
      }
    } else if transformedMetadataObject is AVMetadataFaceObject {
      metadataObjectOverlayLayer.path = CGPath(rect: transformedMetadataObject!.bounds, transform: nil)
    }
    
    return metadataObjectOverlayLayer
  }
  
  
  func barcodeOverlayPathWithCorners(_ corners: [CFDictionary]) -> CGMutablePath {
    let path = CGMutablePath()
    
    if !corners.isEmpty {
      guard let corner = CGPoint(dictionaryRepresentation: corners[0]) else { return path }
      path.move(to: corner, transform: .identity)
      
      for cornerDictionary in corners {
        guard let corner = CGPoint(dictionaryRepresentation: cornerDictionary) else { return path }
        path.addLine(to: corner)
      }
      
      path.closeSubpath()
    }
    
    return path
  }
  
  var removeMetadataObjectOverlayLayersTimer: Timer?
  
  @objc  func removeMetadataObjectOverlayLayers() {
    for sublayer in metadataObjectOverlayLayers {
      sublayer.removeFromSuperlayer()
    }
    metadataObjectOverlayLayers = []
    
    removeMetadataObjectOverlayLayersTimer?.invalidate()
    removeMetadataObjectOverlayLayersTimer = nil
  }
  
  func addMetadataObjectOverlayLayersToVideoPreviewView(_ metadataObjectOverlayLayers: [MetadataObjectLayer]) {
    // Add the metadata object overlays as sublayers of the video preview layer. We disable actions to allow for fast drawing.
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    for metadataObjectOverlayLayer in metadataObjectOverlayLayers {
      previewLayer.addSublayer(metadataObjectOverlayLayer)
    }
    CATransaction.commit()
    
    // Save the new metadata object overlays.
    self.metadataObjectOverlayLayers = metadataObjectOverlayLayers
    
    // Create a timer to destroy the metadata object overlays.
    removeMetadataObjectOverlayLayersTimer = Timer.scheduledTimer(timeInterval: 1, target: self, selector: #selector(removeMetadataObjectOverlayLayers), userInfo: nil, repeats: false)
  }
  
  // MARK: Handle button clicked
  @IBAction func btnTakePictureClicked(_ sender: UIButton) {
    self.view.bringSubview(toFront: activityIndicatorView!)
    activityIndicatorView?.isHidden = false
    activityIndicatorView?.startAnimating()
    if let videoConnection = stillImageOutput.connection(withMediaType: AVMediaTypeVideo) {
      stillImageOutput.captureStillImageAsynchronously(from: videoConnection) {
        (imageDataSampleBuffer, error) -> Void in
        let imageData = AVCaptureStillImageOutput.jpegStillImageNSDataRepresentation(imageDataSampleBuffer)
        let image = UIImage(data: imageData!)
        //                UIImageWriteToSavedPhotosAlbum(image!, self, #selector(self.image(_:didFinishSavingWithError:contextInfo:)), nil)
        print("Upload image")
        if image != nil {
          print("Start Upload image")
          self.upload(image!)
        }
      }
    }
  }
  
  // MARK: Show animation
  func loadAnimationNamed(named:String, atFrame frame: CGRect) {
    let laAnimation = LOTAnimationView.init(name: named)
    laAnimation?.contentMode = .scaleAspectFit
    laAnimation?.frame = frame
    view.addSubview(laAnimation!)
    view.setNeedsLayout()
    laAnimation?.play()
    
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5, execute: {
      laAnimation?.removeFromSuperview()
    })
  }
  // MARK: API Server
  func upload(_ image: UIImage) {
    let myimage = self.imageWithImage(sourceImage: image, scaleFactor: 0.6)
    let imgData = UIImageJPEGRepresentation(myimage, 1)!
    let parameters = ["name": ""]
    
    Alamofire.upload(multipartFormData: { multipartFormData in
      multipartFormData.append(imgData, withName: "myfile",fileName: "file.jpg", mimeType: "image/jpg")
      for (key, value) in parameters {
        multipartFormData.append(value.data(using: String.Encoding.utf8)!, withName: key)
      }
    }, to:"\(SERVER_URL)/object") { [weak self] (result) in
      guard let strongself = self else {
        return
      }
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.5, execute: {
        strongself.activityIndicatorView?.isHidden = true
        strongself.activityIndicatorView?.stopAnimating()
      })
      switch result {
      case .success(let upload, _, _):
        upload.uploadProgress(closure: { (progress) in
          print("Upload Progress: \(progress.fractionCompleted)")
        })
        
        upload.responseJSON { response in
          print("Response: \(String(describing: response))")
          print(response.result.value ?? "nil")
          guard let objects = response.result.value as? [Dictionary<String, String>] else {
            print("Return")
            return
          }
          strongself.listObjects.removeAll()
          var isSuccess = false
          for mtobject in objects {
            let x1 = Double(mtobject["x1"]!)
            let x2 = Double(mtobject["x2"]!)
            let y1 = Double(mtobject["y1"]!)
            let y2 = Double(mtobject["y2"]!)
            let name = mtobject["class"]
            let accuracy = Double(mtobject["accuracy"]!)
            guard var mtx1 = x1, var mtx2 = x2, var mty1 = y1, var mty2 = y2, let mtname = name, let mtaccuracy = accuracy else {
              print("Break")
              break
            }
            var width = mtx2 - mtx1
            var height = mty2 - mty1
            let screenWidth = strongself.view.frame.width
            let ratio = Double(myimage.size.width/screenWidth)
            print("ratio: \(ratio)")
            mtx1 = mtx1 / ratio
            mtx2 = mtx2 / ratio
            mty1 = mty1 / ratio
            mty2 = mty2 / ratio
            width = width / ratio
            height = height / ratio
            if strongself.mode == .exam {
              if strongself.vocab != nil {
                if mtname == strongself.vocab!.word.lowercased() {
                  // SUCCESS
                  strongself.listObjects.append(MTObject.init(name: mtname, x: mtx1, y: mty1 , width: width, height: height, accuracy: mtaccuracy))
                  // SHOW ANIMATION
                  if strongself.currentIndex == 0{
                    isSuccess = true
                  }
                } else if mtname == "pottedplant" {
                  strongself.listObjects.append(MTObject.init(name: mtname, x: mtx1, y: mty1 , width: width, height: height, accuracy: mtaccuracy))
                  if strongself.currentIndex == 1{
                    isSuccess = true
                  }
                } else if mtname == ""{
                  strongself.listObjects.append(MTObject.init(name: mtname, x: mtx1, y: mty1 , width: width, height: height, accuracy: mtaccuracy))
                }
              }
            } else {
              strongself.listObjects.append(MTObject.init(name: mtname, x: mtx1, y: mty1 , width: width, height: height, accuracy: mtaccuracy))
            }
          }
          strongself.drawObjectLabels()
          if strongself.mode == .exam && isSuccess{
            if strongself.currentIndex == 0 {
              strongself.currentIndex = 1
              strongself.showCheckmarkSuccess()
              strongself.titleLabel.text = "Find \(strongself.lesson?.vocabs[1].word.uppercased() ?? "")"
              return
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0, execute: {
              strongself.showViewSuccess()
            })
          }
        }
      case .failure(let encodingError):
        print(encodingError)
      }
    }
  }
  
  func showAnimationSuccess() {
    
  }
  
  func getImagesOfCategory(_ category: String) {
    //        loadImagesRequest?.cancel()
    //        loadImagesRequest = nil
    self.listURIImage.removeAll()
    let url = "\(SERVER_URL)/images?category=\(category)&single_object=0"
    loadImagesRequest = Alamofire.request(url).responseJSON { response in
      print("Response: \(String(describing: response.result.value))")
      if let error = response.error {
        print("Error : \(error)")
        return
      }
      guard let result = response.result.value as? Dictionary<String, Any>,
        let images = result["message"] as? [Dictionary<String, String>] else {
          return
      }
      for image in images {
        let imgurl = image["uri"]
        guard let img = imgurl else {
          return
        }
        let uri = "\(SERVER_URL)\(img)"
        self.listURIImage.append(uri)
      }
      self.collectionView.reloadData()
    }
  }
  
  // Mark: Draw Labels
  func drawObjectLabels() {
    listObjectLabels.forEach({ $0.removeFromSuperview() })
    listObjectButtons.forEach({ $0.removeFromSuperview() })
    for (index, mtobject) in listObjects.enumerated() {
      let label = LTMorphingLabel.init(frame: CGRect.init(x: (mtobject.x + mtobject.width / 2.0), y: (mtobject.y + mtobject.height / 2.0), width: 200, height: 30))
      label.backgroundColor = .clear
      label.textColor = .white
      label.morphingEffect = LTMorphingEffect.init(rawValue: 6)!
      label.font = UIFont.systemFont(ofSize: 25.0)
      self.view.addSubview(label)
      label.text = mtobject.name
      //            label.textAlignment = .center
      //            label.sizeToFit()
      listObjectLabels.append(label)
      
      
      loadAnimationNamed(named: "TwitterHeart", atFrame: CGRect.init(x: mtobject.x, y: mtobject.y, width: mtobject.width, height: mtobject.height))
      let button = FaveButton.init(frame: CGRect.init(x: mtobject.x, y: mtobject.y, width: mtobject.width, height: mtobject.height))
      button.backgroundColor = .clear
      button.tag = index
      self.view.addSubview(button)
      listObjectButtons.append(button)
      button.sendActions(for: .touchUpInside)
      button.addTarget(self, action: #selector(handleObjectClicked(_:)), for: .touchUpInside)
      if self.mode == .normal {
        button.layer.borderColor = UIColor.red.cgColor
        button.layer.borderWidth = 1.0
      }
    }
    self.view.bringSubview(toFront: btnRemove)
    self.view.bringSubview(toFront: self.btnTakePicture)
    self.view.bringSubview(toFront: self.collectionView)
    if self.mode == .normal {
      self.view.bringSubview(toFront: self.btnRemoveAllLabel)
    }
  }
  
  // MARK: Handle Click In Object
  @IBAction func handleObjectClicked(_ sender: UIButton) {
    let index = sender.tag
    guard index < listObjects.count else {
      return
    }
    let object = listObjects[index]
    self.getImagesOfCategory(object.name)
  }
  
  @IBAction func handleCloseButtonClicked(_ sender: UIButton) {
    if self.mode == .exam {
      self.dismiss(animated: true, completion: nil)
    } else {
      self.navigationController?.popViewController(animated: true)
    }
    
  }
  
  // MARK:
  func showViewSuccess() {
    let successView = SuccessView.init(frame: CGRect.init(x: (self.view.frame.size.width - 252.0) / 2.0, y: (self.view.frame.size.height - 300.0) / 2.0, width: 252.0, height: 300.0))
    successView.parentController = self
    popupController = CNPPopupController(contents:[successView])
    popupController?.theme = CNPPopupTheme.default()
    popupController?.theme.popupStyle = .centered
    popupController?.theme.backgroundColor = .clear
    popupController?.present(animated: true)
  }
  
  func showCheckmarkSuccess() {
    listObjectLabels.forEach({ $0.removeFromSuperview() })
    listObjectButtons.forEach({ $0.removeFromSuperview() })
    let imageView = UIImageView.init(frame: CGRect.init(x: (self.view.frame.size.width - 100) / 2.0, y: (self.view.frame.size.height - 100) / 2.0, width: 100, height: 100))
    popupController = CNPPopupController(contents:[imageView])
    popupController?.theme = CNPPopupTheme.default()
    popupController?.theme.popupStyle = .centered
    popupController?.theme.backgroundColor = .clear
    imageView.animationImages = [#imageLiteral(resourceName: "check1"), #imageLiteral(resourceName: "check2"), #imageLiteral(resourceName: "check3"), #imageLiteral(resourceName: "check4")]
    imageView.animationDuration = 0.5
    imageView.animationRepeatCount = 0
    imageView.startAnimating()
    popupController?.present(animated: true)
    DispatchQueue.main.asyncAfter(deadline: .now() + 3, execute: {
      self.popupController?.dismiss(animated: true)
    })
  }
  
  // MARK:
  func imageWithImage (sourceImage:UIImage, scaleFactor: CGFloat) -> UIImage {
    let oldWidth = sourceImage.size.width
    
    let newHeight = sourceImage.size.height * scaleFactor
    let newWidth = oldWidth * scaleFactor
    
    UIGraphicsBeginImageContext(CGSize(width:newWidth, height:newHeight))
    sourceImage.draw(in: CGRect(x:0, y:0, width:newWidth, height:newHeight))
    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    return newImage!
  }
}

extension ObjectRecognitionVC: AVCaptureMetadataOutputObjectsDelegate{
  func captureOutput(_ captureOutput: AVCaptureOutput!, didOutputMetadataObjects metadataObjects: [Any]!, from connection: AVCaptureConnection!) {
    
  }
  
  func image(_ image: UIImage, didFinishSavingWithError error: Error?, contextInfo: UnsafeRawPointer) {
    if let error = error {
      // we got back an error!
      let ac = UIAlertController(title: "Save error", message: error.localizedDescription, preferredStyle: .alert)
      ac.addAction(UIAlertAction(title: "OK", style: .default))
      present(ac, animated: true)
    } else {
      let ac = UIAlertController(title: "Saved!", message: "Your altered image has been saved to your photos.", preferredStyle: .alert)
      ac.addAction(UIAlertAction(title: "OK", style: .default))
      present(ac, animated: true)
    }
  }
}

extension ObjectRecognitionVC: UICollectionViewDelegate, UICollectionViewDataSource {
  func numberOfSections(in collectionView: UICollectionView) -> Int {
    return 1
  }
  
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return self.listURIImage.count
  }
  
  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "ObjectRegconitionCell", for: indexPath)
    if let mycell = cell as? ObjectRegconitionCell {
      let uri = self.listURIImage[indexPath.row]
      let url = URL(string: uri)
      mycell.imageView.kf.setImage(with: url)
    }
    return cell
  }
}

extension UIDeviceOrientation {
  var videoOrientation: AVCaptureVideoOrientation? {
    switch self {
    case .portrait: return .portrait
    case .portraitUpsideDown: return .portraitUpsideDown
    case .landscapeLeft: return .landscapeRight
    case .landscapeRight: return .landscapeLeft
    default: return nil
    }
  }
}

extension UIInterfaceOrientation {
  var videoOrientation: AVCaptureVideoOrientation? {
    switch self {
    case .portrait: return .portrait
    case .portraitUpsideDown: return .portraitUpsideDown
    case .landscapeLeft: return .landscapeLeft
    case .landscapeRight: return .landscapeRight
    default: return nil
    }
  }
}


