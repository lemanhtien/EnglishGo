//
//  SuccessView.swift
//  AILearningEnglishForKids
//
//  Created by Martin Lee on 5/20/17.
//  Copyright © 2017 Tien Le. All rights reserved.
//

import UIKit

let NOTI_SUCESS_LEVEL = "FinishLevel"
class SuccessView: UIView {
    @IBOutlet var view: UIView!
    @IBOutlet weak var imageView: UIImageView!
    weak var parentController: UIViewController?
    override init(frame: CGRect) {
        super.init(frame: frame)
        nibSetup()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        nibSetup()
    }
    
    private func nibSetup() {
        view = loadViewFromNib()
        view.frame = bounds
        view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.translatesAutoresizingMaskIntoConstraints = true
        addSubview(view)
        imageView.animationImages = [#imageLiteral(resourceName: "pikachu1"), #imageLiteral(resourceName: "pikachu2")]
        imageView.animationDuration = 0.5
        imageView.animationRepeatCount = 0
        imageView.startAnimating()
        view.backgroundColor = .clear
        self.backgroundColor = .clear
    }
    
    private func loadViewFromNib() -> UIView {
        let nib = UINib(nibName: "SuccessView", bundle: nil)
        let nibView = nib.instantiate(withOwner: self, options: nil).first as! UIView
        return nibView
    }
    @IBAction func btnHomeClicked(_ sender: Any) {
        if ((parentController as? ObjectRecognitionVC) != nil) {
            (parentController as? ObjectRecognitionVC)?.popupController?.dismiss(animated: true)
            parentController?.dismiss(animated: true, completion: nil)
            (parentController as? ObjectRecognitionVC)?.currentIndex -= 1
            NotificationCenter.default.post(name: NSNotification.Name(rawValue: NOTI_SUCESS_LEVEL), object: nil)
        }
//        else {
//            (parentController as? ExamOneViewController)?.popupController?.dismiss(animated: true)
//            parentController?.navigationController?.popToRootViewController(animated: true)
//        }
    }
}
